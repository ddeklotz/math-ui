# math-ui

Project for experimenting with pen stroke data.

Note: most of the old code here is for exploring the DTW (Dynamic Time Warp) based KNN approaches for classifying glyphs. It works decently well, but I have a feeling deep learning offers better performance and model file size in the long run, given that KNN approaches grow in space and time complexity when more examples are added, and you need a lot of examples to cover a broad set of writing styles. That said, this project still houses some utilities and UI that I find generally useful.

## quick reference

### view glyph data

src/data.ts loads the data from a json file at the very top. You can point that to any json file with the expected format.

from root directory:
```
npm install
npm start
```
browse to <host url>/list

### process stroke data

utilities/utilities.ts has a convertFile function that can convert files with raw arrays of touch data into the json form we use in various projects. We like the object form because the label can be included alongside the stroke data.

My typical workflow is:
 - run convertFile on the raw data to generate a json file for the data.
 - copy the resulting file into the react app and load it in the viewer.
 - walk through each element in the json file in coordination with the viewer, update the labels as necessary and save to confirm the results in the viewer.


## references for DTW and on-line handwritten text recognition in general

R. Ramos-Garijo, S. Martín, A. Marzal, F. Prat, J.M. Vilar, and D. Llorens:
"An Input Panel and Recognition Engine for On-Line Handwritten Text Recognition"
Artificial Intelligence Research and Development, pp. 223-232, IOS Press, 2007.

F. Prat, A. Marzal, S. Martín, and R. Ramos-Garijo:
"A Two-Stage Template-Based Recognition Engine for On-Line Handwritten Characters"
Proceeding of the Asia-Pacific Workshop 2007 on Visual Information Processing, pp. 77-82, 2007.

best reference paper so far: 2009
A Template-based Recognition System for On-line
Handwritten Characters*
FEDERICO PRAT, ANDRÉS MARZAL, SERGIO MARTÍN, RAFAEL RAMOS-GARIJO
AND MARÍA JOSÉ CASTRO+

Improving a DTW-Based Recognition Engine for On-line Handwritten Characters by Using MLPs: 2009
María José Castro-Bleda; Salvador España-Boquera; Jorge Gorbe-Moya; Francisco Zamora-Martínez; David Llorens-Piñana; Andrés Marzal-

Isolated handwriting recognition via multi-stage Support Vector Machines: 2012
Nadine Hajj; Mariette Awad