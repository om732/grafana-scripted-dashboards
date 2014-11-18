/* global _ */

/*
 * Complex scripted dashboard
 * This script generates a dashboard object that Grafana can load. It also takes a number of user
 * supplied URL parameters (int ARGS variable)
 *
 * Return a dashboard object, or a function
 *
 * For async scripts, return a function, this function must take a single callback function as argument,
 * call this callback function with the dashboard object (look at scripted_async.js for an example)
 */



// accessable variables in this scope
var window, document, ARGS, $, jQuery, moment, kbn;

// Setup some variables
var dashboard, timspan, refresh;

// All url parameters are available via the ARGS object
var ARGS;

// Set a default timespan if one isn't specified
timspan = '1d';

// Intialize a skeleton with nothing but a rows array and service object
dashboard = {
  rows : [],
};

// Set a title
dashboard.title = 'sample title';

// Set a time
dashboard.time = {
  from: "now-" + (ARGS.from || timspan),
  to: "now"
};

// Set a refresh time
dashboard.refresh = '15m';

// Get json data
function get_data(url) {
  var defer =  $.Deferred();
  $.ajax({
    url: url,
    dataType: 'json',
    success: defer.resolve,
    error: defer.reject
  });
  return defer.promise();
}

var seriesName = 'HostName';
var seriesKey = 'HostKey';
var itemName = 'items';

if(!_.isUndefined(ARGS.name)) {
  seriesName = ARGS.name;
}

if(!_.isUndefined(ARGS.key)) {
  seriesKey = ARGS.key;
}

if(!_.isUndefined(ARGS.item)) {
  itemName = ARGS.item;
}

var request_api_url = "/json/json.rb?key=" + seriesKey + "&item=" + itemName + "&name=" + seriesName;

// loading
$("body").append("<img id='loading' style='position:absolute;top: 50%;left: 50%;'src='/img/load_big.gif'>")

$.when(
  get_data(request_api_url)
).done(function(data) {
  
  console.log(data);
  // clientsの処理
  var summary_html = '<ul>';
  $(data[0]['clients']).each(function() {
    console.log(this['name']);
    summary_html = summary_html
                 + '<li><a href="/#/dashboard/script/scripted.js?key=ip-'
                 + this['address'].replace(/\./g, "-")
                 + '&item=' + this['subscriptions'].join()
                 + '&name=' + this['name'] + '">'
                 + this['name'] + '</a></li>';
  });
  summary_html = summary_html + '</ul>';
  
  // clientsの情報をpush
  dashboard.rows.push({
    id: 1,
    title: 'links',
    height: '300px',
    showTitle: true,
    editable: true,
    panels: [
      {
        id: 1,
        title: 'server links',
        type: 'text',
        mode: 'html',
        showTitle: false,
        span: 12,
        fill: 1,
        content: summary_html
      }
    ],
    collapse: true
  });
  
  // metricsの情報をpush
  dashboard.rows.push({
    id: 2,
    title: seriesName,
    height: '300px',
    showTitle: true,
    editable: false,
    panels: data[0]['template']
  });
  
}).fail(function() {
  var error_html = '<div class="page-alert-list"><div ng-repeat="alert in dashAlerts.list" class="alert-error alert"><div class="alert-title ng-binding">Error</div><div class="ng-binding" ng-bind-html="alert.text">API request error</div></div></div>';
  $("body").append(error_html)
}).always(function() {
  $("#loading").remove();
});

return dashboard;
