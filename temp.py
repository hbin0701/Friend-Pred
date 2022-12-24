# Replace setup function in lbox_open/data_module/data_precedent.py with this code.
# to replicate the model that we trained.

def setup(self, stage):
    if not self.use_local_data:
        assert self.raw_data is None
        self.raw_data = datasets.load_dataset(
            self.dataset_card, "ljp_criminal")  # temporary
        # self.raw_data = datasets.load_dataset(self.dataset_card, "summarization") # temporary

        # CHANGE THIS AS IF IT'S A SUMMARIZATION.
        # PROCESS SELF.RAW_DATA:
        # ADD ALL train, valid, test

        # For now, filter out those who have really long length.
        from transformers import AutoTokenizer
        tokenizer = AutoTokenizer.from_pretrained("lbox/lcube-base")

        # Exclude long ones.
        def hasAccLength(ex):
            a = len(tokenizer.tokenize(ex['reason']))
            b = len(tokenizer.tokenize(ex['facts']))
            return a < 760 and b < 760

        def add_result(x):
            x['reason'] = x['label']['text'] + "\n" + x['reason']
            return x

        # ADDED
        import random

        def add_text(x):
            if random.uniform(0, 1) < 0.8:
                x['precedent'] = x['precedent'] + "\n" + x['add_info']

            return x

        def check_reason(x):
            reason = x['reason']
            cond1 = len(reason) > 100
            cond2 = len([x for x in ['1.', '2.', '3.'] if x in reason]) == 3
            return cond1 and cond2

        for mode in ["train", "validation", "test", "test2"]:
            # BELOW LINE ADDED 11-18
            self.raw_data[mode] = self.raw_data[mode].map(
                lambda x: add_result(x))

            self.raw_data[mode] = self.raw_data[mode].filter(
                lambda example: check_reason(example))
            self.raw_data[mode] = self.raw_data[mode].filter(
                lambda example: hasAccLength(example))
            self.raw_data[mode] = self.raw_data[mode].rename_column(
                "reason", "summary")
            self.raw_data[mode] = self.raw_data[mode].rename_column(
                "facts", "precedent")
            self.raw_data[mode] = self.raw_data[mode].remove_columns(
                ["casetype", "casename", "label", "ruling"])

        # ADD ADDITIONAL INFO FOR TRAINING
        all_info = []
        df = pd.read_csv("/workspace/AI599/papago_back_translated.csv")
        df_g = df.groupby("id").apply(lambda x: '\n'.join(x["kor_result"]))

        for x in self.raw_data["train"]:
            id = x['id']
            if id in df_g:
                add_info = df_g[x['id']]
            else:
                add_info = ''

            all_info.append(add_info)

        self.raw_data["train"] = self.raw_data["train"].add_column(
            "add_info", all_info)
        self.raw_data["train"] = self.raw_data["train"].map(
            lambda x: add_text(x))
        self.raw_data["train"] = self.raw_data["train"].remove_columns([
                                                                       "add_info"])

    # # Assign train/val datasets for use in dataloaders
    if stage in ["fit", "test"] or stage is None:
        for target_parse, target_sub_parses in self.target_parses_dict.items():
            self.data_ts[target_parse] = PrecedentData(
                self.cfg,
                "train",
                target_parse,
                target_sub_parses,
                self.raw_data[self.training_set_name],
            ).features
            self.data_vs[target_parse] = PrecedentData(
                self.cfg,
                "valid",
                target_parse,
                target_sub_parses,
                self.raw_data[self.validation_set_name],
            ).features
            if "test" in self.raw_data:
                self.data_es[target_parse] = PrecedentData(
                    self.cfg,
                    "test",
                    target_parse,
                    target_sub_parses,
                    self.raw_data[self.test_set_name],
                ).features
