# from transformers import TrainingArguments, Trainer

from app.model.phi3Model import model, tokenizer
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
import torch

# model_name = "microsoft/Phi-3-mini-4k-instruct"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16).cuda()

# your dataset / training setup here
training_args = TrainingArguments(
    output_dir="./trained_model",
    per_device_train_batch_size=2,
    num_train_epochs=1,
    save_strategy="epoch"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
)
trainer.train()
trainer.save_model("./trained_model")
