#!/usr/bin/env python
from __future__ import with_statement
from contextlib import closing
from zipfile import ZipFile, ZIP_DEFLATED
import os, json

def zipdir(basedir, archivename):
    assert os.path.isdir(basedir)
    with closing(ZipFile(archivename, "w", ZIP_DEFLATED)) as z:
        for root, dirs, files in os.walk(basedir):
            #NOTE: ignore empty directories
            for fn in files:
                absfn = os.path.join(root, fn)
                zfn = absfn[len(basedir)+len(os.sep):] #XXX: relative path
                z.write(absfn, zfn)

if __name__ == '__main__':
    with open('src/manifest.json') as manifest:
        data = json.load(manifest)
    ver = data["version"]
    basedir = 'src'
    archivename = 'build/supreme-bot-chrome-'+ver+'.zip'
    zipdir(basedir, archivename)