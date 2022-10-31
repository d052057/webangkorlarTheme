# webangkorlarTheme
This a sample of creating a theme with Bootstrap based.
These are the requirements:
install SASS, POSTCSS and AUTOPREFIXER.

The code produced from the above components/packages won't be the same as codes produced by Bootstrap in dist.

You must include ".browerslistrc" in the root directory to produce the same result.

Just to verify this: You product your theme without the ".browerslistrc" and you will see that 
::-webkit-file-upload-button {
  font: inherit;
  -webkit-appearance: button;
}

is missing from you theme file (it will be more if you look further down).

Most of Youtube videos did not cover the ".browerslistrc" and they just test a different area and of course it works. However, their themes won't match with orig code from Boostrap.

Good luck.
