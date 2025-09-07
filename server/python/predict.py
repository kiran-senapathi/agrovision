#!/usr/bin/env python3
import sys, os, json
from PIL import Image
import torch
from torchvision import models, transforms

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error":"No image path provided"}))
        return
    image_path = sys.argv[1]
    model_path = os.path.join(os.path.dirname(__file__), "best_resnet18_plantvillage.pth")
    if not os.path.exists(model_path):
        print(json.dumps({"error": f"Model file not found at {model_path}"}))
        return
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # Define model
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
    model.fc = torch.nn.Linear(model.fc.in_features, 16)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()
    # Classes - must match your training order
    class_names = ['Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy', 'PlantVillage',
                   'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
                   'Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight',
                   'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot',
                   'Tomato_Spider_mites_Two_spotted_spider_mite',
                   'Tomato__Target_Spot', 'Tomato__Tomato_YellowLeaf__Curl_Virus',
                   'Tomato__Tomato_mosaic_virus', 'Tomato_healthy']
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
    ])
    # Load image
    try:
        img = Image.open(image_path).convert("RGB")
    except Exception as e:
        print(json.dumps({"error": f"Failed to open image: {e}"}))
        return
    inp = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        out = model(inp)
        probs = torch.nn.functional.softmax(out, dim=1)[0]
        topk = torch.topk(probs, k=3)
        results = []
        for p, idx in zip(topk.values.tolist(), topk.indices.tolist()):
            results.append({"class": class_names[idx], "confidence": float(p)})
    print(json.dumps({"predictions": results}))

if __name__ == "__main__":
    main()
