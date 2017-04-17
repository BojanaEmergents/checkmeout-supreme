#!/usr/bin/env python
from __future__ import with_statement
from contextlib import closing
from zipfile import ZipFile, ZIP_DEFLATED
import os, json, shutil
from subprocess import call

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
    basedir = 'src'
    copydir = 'dist'

    with open('src/manifest.json') as manifest:
        data = json.load(manifest)
    ver = data["version"]

    print 'Packaging version ' + ver

    print 'Clearing old files...'
    shutil.rmtree('dist')

    print 'Copying...'
    shutil.copytree(basedir, copydir)

    os.chdir('dist')

    print 'Obfuscating...'
    os.system("uglifyjs navigate.js -o navigate.js")

    os.chdir('..')

    print 'Building...'
    archivename = 'build/supreme-bot-chrome-'+ver+'.zip'
    zipdir(copydir, archivename)

    print 'Done!'