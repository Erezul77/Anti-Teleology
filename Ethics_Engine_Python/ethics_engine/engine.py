class Proposition:
    def __init__(self, number, label, dependencies, proof_func):
        self.number = number
        self.label = label
        self.dependencies = dependencies
        self.proof_func = proof_func

    def prove(self):
        print(f"Proving {self.number}: {self.label}")
        try:
            result = self.proof_func()
            print("✔ Proof completed:", result)
            return result
        except Exception as e:
            print("❌ Proof failed:", e)
            return False
