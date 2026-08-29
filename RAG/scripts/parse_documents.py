from pathlib import Path
from docling.document_converter import DocumentConverter
from tqdm import tqdm

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_DIR = BASE_DIR / "knowledge_base"
OUTPUT_DIR = BASE_DIR / "parsed_docs"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

converter = DocumentConverter()

pdf_files = list(INPUT_DIR.rglob("*.pdf"))

print(f"\nFound {len(pdf_files)} PDF(s).\n")

for pdf_path in tqdm(pdf_files, desc="Parsing PDFs"):

    try:

        print(f"\nProcessing: {pdf_path.name}")

        result = converter.convert(str(pdf_path))

        markdown = result.document.export_to_markdown()

        relative_path = pdf_path.relative_to(INPUT_DIR)

        output_file = OUTPUT_DIR / relative_path.with_suffix(".md")

        output_file.parent.mkdir(parents=True, exist_ok=True)

        output_file.write_text(markdown, encoding="utf-8")

        print(f"Saved -> {output_file}")

    except Exception as e:

        print(f"\nFailed: {pdf_path.name}")

        print(e)

print("\nAll documents parsed successfully!")

