// Generated by CoffeeScript 2.7.0
var plot_data;
d3.json("salaries.json").then(function (salaries) {
  return d3.json("titles.json").then(function (titles) {
    return d3.json("divisions.json").then(function (divisions) {
      var dropdown, i, jobcodes, opts, person_division, person_index, title, v, x;
      dropdown = d3.select("body").select("select#division");
      opts = dropdown.selectAll("option").data(divisions).enter().append("option").text(function (d) {
        return d;
      }).attr("value", function (d) {
        return d;
      });
      // insert title into salaries dataset
      salaries.forEach(function (d) {
        return d.title = titles[d.JobCode];
      });
      // create object that has title -> job codes
      jobcodes = {};
      for (x in titles) {
        title = titles[x];
        if (!(jobcodes[title] != null)) {
          jobcodes[title] = [];
        }
        jobcodes[title].push(x);
      }
      // index of people: vector with {name: first|last|div, index: numeric index}
      person_division = function () {
        var j, len, results;
        results = [];
        for (j = 0, len = salaries.length; j < len; j++) {
          v = salaries[j];
          results.push([v.FirstName, v.LastName, v.Division].join("|"));
        }
        return results;
      }();
      person_index = [];
      for (i in person_division) {
        person_index.push({
          name: person_division[i],
          index: i
        });
      }
      // add
      return d3.select("button").on("click", function () {
        return plot_data(salaries, divisions, jobcodes, person_index);
      });
    });
  });
});
plot_data = function (salaries, divisions, jobcodes, person_index) {
  var all_indices, first_name, index_in_data, last_name, scope, scope_across, selected_div, this_person;
  // grab form data
  last_name = d3.select("input#last_name").property("value");
  first_name = d3.select("input#first_name").property("value");
  // division
  selected_div = d3.select("select#division option:checked").text();
  // scope
  scope_across = d3.select("input#across").property("checked");
  scope = scope_across ? "across" : "within";
  // look for the person in the data
  this_person = [first_name, last_name, divisions.indexOf(selected_div) + 1].join("|").toUpperCase();
  console.log(this_person);
  index_in_data = person_index.find(function (d) {
    return d.name === this_person;
  });
  if (index_in_data != null) {
    // if multiple records for that person: pick a random one?
    all_indices = person_index.filter(function (d) {
      return d.name === this_person;
    });
    if (all_indices.length > 1) {
      // pick a random one
      index_in_data = all_indices[Math.floor(Math.random() * all_indices.length)];
    } // individual was found
  }

  console.log(index_in_data);
  //    result = (v for v in x when v.a==2 and v.b==4)
  return d3.select("div#chart").text(`hello ${first_name} ${last_name} (${selected_div}) - ${scope}`);
};

// look for matching record
// find the job codes for that person's title
// look for other people with one of those job codes (overall, or within that division)
// dotplot of those points
// add boxplot over the dotplot