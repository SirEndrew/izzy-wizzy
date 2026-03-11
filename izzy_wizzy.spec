# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for Izzy Wizzy
# Build: pyinstaller izzy_wizzy.spec

import sys

block_cipher = None
IS_MAC = sys.platform == 'darwin'
IS_WIN = sys.platform == 'win32'

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
        'webview',
        'webview.platforms.winforms',
        'webview.platforms.edgechromium',
        'webview.platforms.cocoa',
        'webview.platforms.gtk',
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
    console=False,
    onefile=True,
    icon='static/img/icon.ico' if IS_WIN else ('static/img/icon.icns' if IS_MAC else None),
)

# На Mac дополнительно создаём .app bundle
if IS_MAC:
    app = BUNDLE(
        exe,
        name='IzzyWizzy.app',
        icon='static/img/icon.icns',
        bundle_identifier='ru.izzywizzy.app',
        info_plist={
            'NSPrincipalClass': 'NSApplication',
            'NSHighResolutionCapable': True,
            'CFBundleShortVersionString': '0.9B',
            'CFBundleName': 'Izzy Wizzy',
            'LSMinimumSystemVersion': '10.13.0',
        },
    )
