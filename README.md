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

The main subject of UIjson are the properties which hold data.These 'dataholder' properties can have value of type string,number,boolean or an array of these types.See <span style="color:red;">dataholders</span> of 'example' in RED highlight. These are the properties which can be handled by UIjson. Blue properties will be Ignored
<pre>
var example  = {
       <span class="p_dataholders">name</span>      : "Julian",
       <span class="p_dataholders">age</span>       : "20",
       <span class="p_dataholders">country</span>   : "USA",
       <span class="p_dataholders">past_jobs</span> : ["Philips","ikea","apple","microsoft"],
       <span class="n_dataholders">children</span>  : [ {<span class="p_dataholders">name</span>:""},{<span class="p_dataholders">name</span>:""} ],
       <span class="n_dataholders">job</span>       : {}
};								
								</pre>


## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snipp
