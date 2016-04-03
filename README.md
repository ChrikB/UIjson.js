# UIjson.js

A tool to do a lot

## What is UIjson.js

## Example

## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## Configuration

First you need to include following files in head of your page for bootstrap,Jquery

### a) Include files in &lt;head&gt;&lt;/head&gt;
```html
<script src="http://code.jquery.com/jquery-2.2.0.min.js" type="text/javascript"></script> 
<script src="js/jquery-ui.min.js"></script>  
<script src="js/bootstrap.min.js" type="text/javascript"></script> 

<link rel="stylesheet" href="css/bootstrap.css">
<script src="UIjson.js"></script>
			 
```

### b) Understanding Dataholders

The main subject of UIjson are the properties which hold data.These 'dataholder' properties can have value of type string,number,boolean or an array of these types. Other properties will be ignored.

<pre>
var example  = {
       name      : "Julian",
       age       : "20",
       country   : "USA",
       past_jobs : ["Philips","ikea","apple","microsoft"],
       children  : [ {name:""},{name:""} ],
       job       : {}
};								
								</pre>
Properties : **job** and **childen** of example are not dataholder - properties because their values are not strings

### c) Defining Dataholder properties

To configure UIjson you will need to define a dataholder object for each property you want to import. Undefined properties will not be removed as they are part of your model, but you will not able to render or edit them.They will be ignored from all UIjson's functionality.

```html
//To define a dataholder Object you need at least to set these 2 properties, 'property' and 'assignTo'

var dataHolder = { 

   property:"name" , 
   assignTo:"input_field" 
};

//And here the full options of dataholder Object

var dataHolder = { 

   property  :"name" ,        // the property
   path      : "",            // Path may be used when you add a nested object which is part of a bigger instance, to separate this dataholder from others if they have same properties.
   assignTo  :"input_field"   // How this property will be rendered in HTML.There a list of UI types in code architecture section of documentation.
   tabName   :"Bio"  ,        // Default tab is 'General'. Only if tab with label 'Bio' is active you will be able to see the UI element for this property.
   label     :"Person's Name" // Label text goes to 'control-label' element of bootstrap.
   options   :[],             // Options required if assignTo is "select_list", "radio" or "checkbox"
   arrEach   : false,         // If true means that if the value of the object is an array of strings,each element of the array will be a seperate UI element in HTML
   array_Api : {              // It has meaning only if arrEach = true 
   
                sortable : true ,   // If true You can sort elements. This requires jquery-ui.
                add      : true ,   // If true You can add new elements by clicking a symbol.
                remove   : true     // If true You can remove an UI element from the array by clicking a symbol.
				
   }  
};

```

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snipp
