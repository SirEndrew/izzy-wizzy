import sys
import traceback

try:
    from flask import Flask
    print("Flask OK")
except Exception as e:
    print(f"Flask ERROR: {e}", file=sys.stderr)
    sys.exit(1)

try:
    import fill_pdf
    print("fill_pdf OK")
except Exception as e:
    print(f"fill_pdf ERROR: {e}", file=sys.stderr)
    traceback.print_exc()
    sys.exit(1)

try:
    import app
    print("app OK")
except Exception as e:
    print(f"app ERROR: {e}", file=sys.stderr)
    traceback.print_exc()
    sys.exit(1)

print("ALL OK")