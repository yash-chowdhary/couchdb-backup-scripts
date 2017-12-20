var str = '"seq":"4802-g1AAAAICeJzLYWBg4MhgTmGQS0lKzi9KdUhJMtRLSszMyizVS87JL01JzCvRy0styQGqY0pkSJL___9_VgZzEpDnlwsUY7dMMkpONTYlaACxdiQpAMkke5A1IEvSidbnANIXD9OXR7S-BJC-epg-N2L15bEASYYGIAXUOh-s15o0vQsgeveTo_cARO99sN520vQ-gOiF-DcmCwDUg6Qz","id":"efd6445514cf4c7fe2867131e0b0285e","changes":[{"rev":"3-a26dff4135617338ae46c2356cac4356"';
var obj = str.split('\"');
console.log(obj);
console.log(obj[obj.indexOf('id')+2]);
id = 
var x = "http://localhost:5984/test_db_3/"+id;