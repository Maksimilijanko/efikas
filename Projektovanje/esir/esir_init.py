import argparse
import requests
import json
import sys
import base64
import os

def image_to_base64(image_path):
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            return encoded_string
    except FileNotFoundError:
        print(f"Error: File not found at {image_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error converting image to Base64: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(
        description="ESIR init sciript"
    )
    
    parser.add_argument("--ip", help="ESIR device IP address")
    parser.add_argument("--api_key", help="ESIR device API key")
    
    parser.add_argument("--image", help="Path leading to .gif image for receipt header")
    
    args = parser.parse_args()

    final_image_base64 = None

    if args.image:
        print(f"Loading and converting the image: {args.image}...")
        final_image_base64 = image_to_base64(args.image)
        print("Conversion done!")

    ENDPOINT_PATH = "/api/settings" 
    url = f"http://{args.ip}:3566{ENDPOINT_PATH}"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {args.api_key}"
    }

    payload = {
        "printerName": "Internal",
        "printerType": "EscPos",
        "receiptWidth": 384,
        "receiptLayout": "Slip",
        "receiptFontSizeNormal": 21,
        "receiptFontSizeLarge": 24,
        "receiptHeaderTextLines": ["", "Račun štampan iz aplikacije", ""],
        "receiptHeaderImage": final_image_base64,
        "receiptFooterTextLines": [],
        "receiptFooterImage": None,
        "receiptFeedLinesBegin": 0,
        "receiptFeedLinesEnd": 3,
        "receiptCutPaper": "FeedAndCutPaper",
        "receiptOpenCashDrawer": "Epson_1",
        "qrCodeSize": 386
    }

    print(f"Sending POST request to: {url}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        
        if response.status_code == 200:
            print("\nSUCCESS! Server has accepted the request.")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(response.text)
        else:
            print(f"\nError! Status {response.status_code}")
            print(response.text)

    except Exception as e:
        print(f"\nError: {e}")

if __name__ == "__main__":
    main()