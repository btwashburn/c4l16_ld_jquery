# Consuming Linked Data Using JQuery

A demonstration application using JQuery and rdflib.js to parse and display Linked Data from OCLC. 

## Installation

### Step 1: Clone the repository from GitHub

In a Terminal Window

```bash
$ cd {YOUR-APACHE-DOCUMENT-ROOT}
$ git clone https://github.com/btwashburn/c4l16_ld_jquery.git
$ cd c4l16_ld_jquery
```
### Step 2: Install rdflib.js

The dependency on rdflib.js is specified in the package.json file.  To install, use the Node Package Manager:

```npm install```

## Usage

To run the app, point your web browser at the localhost address where these instructions will install it by default. 

[http://localhost/c4l16_ld_jquery/](http://localhost/c4l16_ld_jquery/)

Note that the "index.html" file will look for the rdflib.js dependency as a relative path "node_modules/rdflib/dist/" under the root path where the application was installed.  If you have moved rdflib.js in another path on your system, make sure that its location is accessible by browsers through your web serverm, and edit the index.html path to the library accordingly.
