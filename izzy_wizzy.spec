# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for Izzy Wizzy
# Build: pyinstaller izzy_wizzy.spec

block_cipher = None

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('templates', 'templates'),
        ('static',    'static'),
    ],
    hiddenimports=[
        'flask',
        'werkzeug',
        'werkzeug.serving',
        'werkzeug.utils',
        'jinja2',
        'pypdf',
        'pypdfium2',
        'pypdfium2._library',
        'ctypes',
        'ctypes.util',
        # pywebview backends (Windows uses edgechromium or mshtml)
        'webview',
        'webview.platforms.winforms',
        'webview.platforms.edgechromium',
        'clr',
    ],
    hookspath=[],
    runtime_hooks=[],
    excludes=['tkinter', 'matplotlib', 'numpy', 'scipy', 'PIL'],
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='IzzyWizzy',
    debug=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,          # No console window
    onefile=True,
    icon='static/img/icon.ico',  # convert icon.svg → icon.ico beforehand
)
