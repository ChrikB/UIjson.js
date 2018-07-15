# UIjson.js

Objects in Bootstrap Interface 
## Demo

[http://www.scriptrain.com/projects/uijson/UIjson.js-demo-page.html](http://www.scriptrain.com/projects/uijson/UIjson.js-demo-page.html)

Full Api here : [http://www.scriptrain.com/projects/uijson/API](http://www.scriptrain.com/projects/uijson/API)

## What is UIjson.js

UIjson.js is a plugin written in Jquery which uses Bootstrap's classes to render properties of Objects and their values to predefined HTML elements.

It is dependant from jquery and bootstrap

## Motivation

Most of the times in programming we have the need to output data of different types, which are just declared somewhere or they come from a process.Here comes the question of how we will represent them to the end user,in which format and how to manipulate the free space.Here UIjson.js came out.UIjson.js is a jquery plug-in which offers some predefined ways to render,edit and create data from JSON models.It makes use of most popular HTML, CSS, framework: BOOTSTRAP for interface and Javascript,Jquery for functionality.A lot of people love Boostrap because it makes them to not worry about cross browser/platform css compability issues. So since UIjson is expandable, to ensure future compability I decided to use it here to keep you still free of worries. For the same reason I used Jquery.Both have great support, years of life ,great documentations , stability and many places to ask if you need any help. .

## Configuration

First you need to include following files in head of your page for bootstrap,Jquery

### a) Include files in &lt;head&gt;&lt;/head&gt;
1. Files
  1. UIjson.js
  2. UIjson.min.js - a minified version of UIjson.js

##### Dependencies : 
- bootstrap v3.1 
- jquery v2.2.3
- jquery-ui v1.11.4 if you want to make use of sortable and draggable to manipulate array items from interface


```html
<script src="http://code.jquery.com/jquery-2.2.0.min.js" type="text/javascript"></script> 
<script src="js/jquery-ui.min.js"></script>  
<script src="js/bootstrap.min.js" type="text/javascript"></script> 

<link rel="stylesheet" href="css/bootstrap.css">
<script src="UIjson.js"></script>
			 
```

### b) Understanding Dataholders

The main subject of UIjson are the properties which hold data.These 'dataholder' properties can have value of type string,number,boolean or an array of these types. Other properties will be ignored.

```js
var example = {
  name: 'Julian',
  age: '20',
  country: 'USA',
  past_jobs: [ 'Philips', 'ikea', 'apple', 'microsoft' ],
  children: [ { name: '' }, { name: '' } ],
  job: {}
};								
```
Properties : **job** and **childen** of example are not dataholder - properties because their values are not strings

### c) Defining Dataholder properties

To configure UIjson you will need to define a dataholder object for each property you want to import. Undefined properties will not be removed as they are part of your model, but you will not able to render or edit them.They will be ignored from all UIjson's functionality.

```js
//To define a dataholder Object you need at least to set these 2 properties, 'property' and 'assignTo'

var dataHolder = { 
  property: 'name' , 
  assignTo: 'input_field' 
};

//And here the full options of dataholder Object

var dataHolder = { 
  property: 'name', // the property
  path: '', // Path may be used when you add a nested object which is part of a bigger instance, to separate this dataholder from others if they have same properties.
  assignTo: 'input_field',   // How this property will be rendered in HTML.There a list of UI types in code architecture section of documentation.
  tabName: 'Bio',        // Default tab is 'General'. Only if tab with label 'Bio' is active you will be able to see the UI element for this property.
   label: 'Person"s Name', // Label text goes to "control-label" element of bootstrap.
   options: [],             // Options required if assignTo is "select_list", "radio" or "checkbox"
   arrEach: false,         // If true means that if the value of the object is an array of strings,each element of the array will be a seperate UI element in HTML
   array_Api: {              // It has meaning only if arrEach = true 
     sortable: true,   // If true You can sort elements. This requires jquery-ui.
     add: true,   // If true You can add new elements by clicking a symbol.
     remove: true     // If true You can remove an UI element from the array by clicking a symbol.			
   }  
};

```
### d) Calling UIjson.js 

Lets configure and call UIjson now for model : exampleOb
```html
//Our HTML:
//The bound selector to UIjson must contain an empty element for tabs with class : 'UIjson nav-tabs' 
//and an empty element for sections with class 'UIjson sections'
//Dont forget that all UI_elements of UIjson.js use bootstrap's Grid system in HTML and bootstrap's classes.

  <div id="MyUI" class="col-md-10 col-lg-10 col-sm-10">
          <ul role="tablist" class="nav UIjson nav-tabs"></ul>
          <div class="tab-content UIjson sections"></div>
  </div>							   
	
```
```js
var exampleOb  = {
  name: 'Julian',
  age: '20',
  country: 'USA',
  past_jobs: [ 'Philips', 'ikea', 'apple', 'microsoft' ]
};

var config = {  
  "properties":  [
    { property: 'name', assignTo: 'input_field', label: 'Persons Name' },	 
    { property: 'age', assignTo: 'input_field', label: 'Persons Age'  },
    { property: 'country', assignTo: 'select_list', label: 'Country', options: [ 'SPAIN', 'USA', 'Brazil', 'Canada' ] },
    { property: 'past_jobs' , assignTo: 'textarea_field', label: 'Portfolio' },		
   ],								
   "_Objects"  : [ { obj: exampleOb, path: '' } ]			
};

$('#MyUI').UIjson(config);

```
## Progress - Behind the scenes

So how it works:

**a)** You define some properties in configuration or using defineProp( .. ) method. The objects you use to define them including some other properties are the Dataholder Objects of UIjson.js.
All dataholder Objects are stored in Dataholders array of UIjson Instance.

**b)** You import some Objects using _Objects in configuration or using ImportObject( .. ) method. Lets say you import the object var **AA = { };**
Once imported , AA will be converted to UIjson Objectand can be used from UIjson methods and events. 
Below you can see how UIjson Objects look like :

```js
var UIjsonObject = {						  
  obj: exampleOb, // A reference to the Imported Object.
  ui_wrapper: null,      // It is a Jquery element and it will not be null only if this Object is rendered.
  dataholders: [],        // This array is filled from Obj_initDataholders( .. ) method
  path: ''         // comes from user's definition
}
```
All UIjson Objects exist in _Objects array of the Instance.

**c)** Filling UIjson_Object.dataholders array. 

All properties of AA will be compared by name and path with the defined Dataholders.Matches will be pushed to UIjson_Object.dataholders array

**d)** Now everytime AA is going to be rendered, some objects of UIjson_Object.dataholders array will have "elements" property filled with some Jquery Selectors.

## Code Architecture

#### Contructor
```js
$.UIjson.Instance = function () {
  this.Settings = '',
  this.Element = null,
  this._Objects = [],
  this.ActiveTab = 'General',			  
  this.Tabs = {},
  this.Sections = {},
  this.Dataholders = []
};
```

#### Defaults

```js

  $.UIjson.defaults = {
     binders: {
       tabs: '.UIjson.nav-tabs' ,
       sections: '.UIjson.sections' ,
       obj: '.UIjson.obj_UI' 
     },
    dataHolder : {
      tabName: 'General' ,
      path: false,
      label: '&nbsp',
      arrEach: false,
      options: false,
      array_Api: {
        sortable: true,
        add: true,
        remove: true
      }
    }
  }; 
```
#### UI HTML Elements

All UI elements exist as properties in **$.UIjson.UI_Elements**. Each name must be unique.

- **_HTML**      contains HTML of element as string
- **Val_Method** sets or returns value of target element.
- **AttachEv**   attach events
- **detachEv**   removes attached events

**Use one of following names in configuration of dataholders to 'assignTo'**

1. input_field
2. textarea_field
3. select_list
4. checkbox
5. radio
6. thumbnail
7. blockquote


## License

UIjson.js Copyright (c) 2016 Chris B

MIT
