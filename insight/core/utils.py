
def print_section(title):
        print("\n" + "="*80)
        print(f"{title:^80}")
        print("="*80)

def print_json(title, obj):
        import json
        print(f"\n{title}:")
        print("-" * 40)
        formatted = json.dumps(obj, indent=2, ensure_ascii=False)
        # 为每行添加缩进
        formatted = "\n".join(f"    {line}" for line in formatted.split("\n"))
        print(formatted)