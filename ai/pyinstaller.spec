import os
from PyInstaller.building.build_main import Analysis, PYZ, EXE

project_root = os.path.abspath(os.path.join(os.getcwd(), ".."))
config_file = os.path.join(project_root, "config.json")

a = Analysis(
    scripts=["src/main.py"],
    pathex=[os.path.join(project_root, "ai", "src")],
    binaries=[],
    datas=[(config_file, ".")],
    hiddenimports=[
        "encodings",         
        "codecs",            
        "site",              
    ],
    hookspath=[],
    runtime_hooks=[],
    excludes=["rapidfuzz.__pyinstaller"],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    name="main",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    target_format='macosx',
)
