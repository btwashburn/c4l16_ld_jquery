      // globals
      var SCHEMA = $rdf.Namespace("http://schema.org/")
      var defaultOclcNum = "82671871";
      var entity = {};
      var kb;
      var uri;
      var request_url;
      var labels = {};
      labels.name = "Title";
      labels.creator = "Author";
      labels.description = "Descriptions";
      labels.about = "Subjects";
    
      // initialize an RDF store
      function initializeRdfStore() {
      
        // create an RDF graph
        kb = $rdf.graph();
        
        // get RDF data
        fetchRdf();
        
      } // end function initializeRdfStore
      
      // get RDF data
      function fetchRdf() {
      
        entity = {};
        entity.id = $("#oclcnum").val();
        uri = 'http://www.worldcat.org/oclc/' + entity.id;
        requestUrl = 'http://experiment.worldcat.org/oclc/' + entity.id + '.rdf'
        var manifestation = $rdf.sym(uri);
        var fetch = $rdf.fetcher(kb);
        fetch.nowOrWhenFetched(requestUrl,undefined,function(ok, body, xhr) { // @@ check ok
          if (ok) {
            getLdProperties(manifestation);
          } else {
            console.log("Fetch failed for "+requestUrl);
          }
        });
        
      } // end function fetchRdf
      
      // get selected linked data properties
      function getLdProperties(manifestation) {
      
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
        
      } // end function getLdProperties
      
      // show linked data properties
      function showLdProperties() {
        var props = ["name","creator","about","description"];
        $.each(props, function( pindex, prop ) {
          $("#"+prop).html("");
          if (entity.hasOwnProperty(prop)) {
            if (entity[prop].length > 0) {
              if ($.isArray(entity[prop])) {
                var str = "";
                str += "<h4>"+labels[prop]+":</h4>";
                str += "<div class=\"list-group\">";
                $.each(entity[prop], function( index, value ) {
                  str += "<div class=\"list-group-item\">"+value+"</div>";
                });
                str += "</div>";
                $("#"+prop).html(str);
              } else {
                $("#"+prop).html(labels[prop] + ": " + entity[prop]);
              }
            }
          } 
        });
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