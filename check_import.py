import sys
import os
os.environ['WEB_MODE'] = 'true'

import app
print("Starting Flask directly...")
app.app.run(host='0.0.0.0', port=8080, debug=True)