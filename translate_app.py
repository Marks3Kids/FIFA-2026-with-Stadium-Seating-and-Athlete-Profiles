#!/usr/bin/env python3
import json
import os
import sys
import time
import deepl

LOCALES_PATH = "client/src/locales"
SOURCE_FILE = os.path.join(LOCALES_PATH, "en.json")

LANGUAGE_MAP = {
    "es": "ES",
    "fr": "FR",
    "de": "DE",
    "nl": "NL",
    "it": "IT",
    "ar": "AR",
    "pt": "PT-BR",
    "ja": "JA"
}

def translate_value(translator, value, target_lang, retries=3):
    if isinstance(value, str):
        if not value.strip():
            return value
        for attempt in range(retries):
            try:
                result = translator.translate_text(value, target_lang=target_lang)
                return result.text
            except Exception as e:
                if "Too many requests" in str(e) and attempt < retries - 1:
                    wait_time = (attempt + 1) * 2
                    print(f"    Rate limited, waiting {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    raise
    elif isinstance(value, dict):
        return {k: translate_value(translator, v, target_lang, retries) for k, v in value.items()}
    elif isinstance(value, list):
        return [translate_value(translator, item, target_lang, retries) for item in value]
    else:
        return value

def translate_to_language(translator, en_data, target_code, deepl_lang):
    print(f"\nTranslating to {target_code.upper()}...")
    translated_data = translate_value(translator, en_data, deepl_lang)
    
    output_file = os.path.join(LOCALES_PATH, f"{target_code}.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
    
    print(f"  Success! Saved to {output_file}")
    return output_file

def main():
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        print("Error: DEEPL_API_KEY environment variable not set.")
        return

    print("=== FIFA 2026 World Cup App Translation Tool ===\n")
    
    if len(sys.argv) > 1:
        target_code = sys.argv[1].strip().lower()
    else:
        print("Usage: python translate_app.py <language_code>")
        print("  Language codes: es, fr, de, nl, it, ar, pt, ja, all")
        return

    print(f"Reading {SOURCE_FILE}...")
    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        en_data = json.load(f)

    translator = deepl.Translator(api_key)

    force = "--force" in sys.argv or "-f" in sys.argv
    
    if target_code == "all":
        print("\nTranslating to all 8 languages...")
        translated_files = []
        for code, deepl_lang in LANGUAGE_MAP.items():
            output_file = os.path.join(LOCALES_PATH, f"{code}.json")
            if os.path.exists(output_file) and not force:
                print(f"\n{code.upper()} already exists, skipping... (use --force to overwrite)")
                translated_files.append(output_file)
                continue
            try:
                output_file = translate_to_language(translator, en_data, code, deepl_lang)
                translated_files.append(output_file)
                time.sleep(2)  # Wait between languages to avoid rate limiting
            except Exception as e:
                print(f"  Error translating to {code}: {e}")
        
        print(f"\n=== Translation Complete ===")
        print(f"Total translation files: {len(translated_files)}")
        for f in translated_files:
            print(f"  - {f}")
    else:
        if target_code not in LANGUAGE_MAP:
            print(f"Error: Invalid language code '{target_code}'. Please choose from: {', '.join(LANGUAGE_MAP.keys())} or 'all'")
            return

        deepl_lang = LANGUAGE_MAP[target_code]
        translate_to_language(translator, en_data, target_code, deepl_lang)
        print("\n=== Translation Complete ===")

if __name__ == "__main__":
    main()
