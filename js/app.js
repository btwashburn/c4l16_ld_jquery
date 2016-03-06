      // globals
      var SCHEMA = $rdf.Namespace("http://schema.org/")
      var defaultOclcNum = "82671871";
      var entity = {};
      var kb;
      var uri;
      var request_url;
      var properties = ["name","creator","about","description"];
      var labels = {};
      labels.name = "Title";
      labels.creator = "Author";
      labels.description = "Descriptions";
      labels.about = "Subjects";
    
      // initialize an RDF store
      function initializeRdfStore() {
      
        // create an RDF graph
        kb = $rdf.graph();
        
        // remove previously-set values in the UI
        $("#record").html("");
        
        // get RDF data
        fetchRdf();
        
      } // end function initializeRdfStore
      
      // get RDF data
      function fetchRdf() {

        entity = {};
        entity.id = $.trim($("#oclcnum").val());
           
        // test whether the requested OCLC number is an integer
        if (Math.floor(entity.id) == entity.id && $.isNumeric(entity.id)) {
      
          uri = 'http://www.worldcat.org/oclc/' + entity.id;
          requestUrl = 'http://experiment.worldcat.org/oclc/' + entity.id + '.rdf'
          var manifestation = $rdf.sym(uri);
          var fetch = $rdf.fetcher(kb);
          fetch.nowOrWhenFetched(requestUrl,undefined,function(ok, body, xhr) { 
            if (ok) {
              getLdProperties(manifestation);
            } else {
              // complain and halt if the string provided for an OCLC number is not an integer
              alert($("#oclcnum").val() + " is not recognized as an OCLC number.");
            }
          });
          
        } else {
        
          // complain and halt if the string provided for an OCLC number is not an integer
          alert($("#oclcnum").val() + " is not a number.");
          
        }
        
      } // end function fetchRdf
      
      // get selected linked data properties
      function getLdProperties(manifestation) {
      
        // check to see if the graph store has a schema name propoerty
        if (kb.the($rdf.sym(uri), SCHEMA('name'))) {
      
          // get entity name
          entity.name = kb.the($rdf.sym(uri), SCHEMA('name')).value;
          
          // get creator name and uri
          entity.creator= kb.the(kb.the(manifestation, SCHEMA('creator')), $rdf.sym('http://schema.org/name')).value;
          entity.creatorUri = kb.the(manifestation, SCHEMA('creator')).uri;
          
          // handle properties that will have multiple values
          var props = ["about","description"];
          $.each(props, function( index, prop ) {
            // for the schema.org about properties, add a list of their name properties to the scope
            var propNodes = kb.each(manifestation, SCHEMA(prop));
            var values = [];
            for (i = 0; i < propNodes.length; i++) {
              if (kb.the(propNodes[i], SCHEMA('name'))) {
                values.push(kb.the(propNodes[i], SCHEMA('name')));
              } else if (propNodes[i].value) {
                values.push(propNodes[i].value);
              }
            }
            entity[prop] = values;
          });
          
          // show the entity properties in the UI
          showLdProperties();
          
        } else {
        
          // the graph doesn't include a name property, so likely did not fetch a manifestation resource
          alert("A valid graph was not found for the OCLC number "+entity.id);
        
        }
        
      } // end function getLdProperties
      
      // show linked data properties
      function showLdProperties() {
        var str = "";
        $.each(properties, function( pindex, prop ) {
          if (entity.hasOwnProperty(prop)) {
            if (entity[prop].length > 0) {
              str += "<div class=\"row\">";
              str += "<div class=\"col-md-2\">";
              str += "<h4 class=\"pull-right\">"+labels[prop]+"</h4>";
              str += "</div>";
              str += "<div class=\"col-md-10\">";
              if ($.isArray(entity[prop])) {
                $.each(entity[prop], function( index, value ) {
                  str += "<h4>"+value+"</h4>";
                });
              } else {
                str += "<h4>"+entity[prop]+"</h4>";
              }
              str += "</div>";
              str += "</div>";
            }
          } 
        });
        $("#record").html(str);
      } // end function showLdProperties
      
      // On ready
      $(document).ready(function() {

        entity.id = defaultOclcNum;
        $("#oclcnum").val(entity.id);
        
        $( "#getLD" ).submit(function( event ) {
          event.preventDefault();
          initializeRdfStore();
        });
        
      });