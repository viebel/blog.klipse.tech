---
layout: post
title:  "An interactive way of writing SQL tutorials"
description:  "An interactive way of writing SQL tutorials"
date:   2016-11-07 12:17:52 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "231003A7-5D6F-474D-9602-74343248C053"
author: "@viebel"
minified_plugin: true
draft: true
hidden: true
klipse_editor_type: "html"
---

# SQL

From today, we can run SQL queries with KLIPSE.

# CREATE TABLE

~~~klipse-sql
CREATE TABLE play (game, points, day)
~~~

# INSERT values

~~~klipse-sql
INSERT INTO play VALUES ("go", 500, "monday");
INSERT INTO play VALUES ("go", 300, "tuesday");
INSERT INTO play VALUES ("chess", 1250, "tuesday");
INSERT INTO play VALUES ("chess", 1250, "tuesday");
INSERT INTO play VALUES ("chess", 50, "sunday");
INSERT INTO play VALUES ("chess", 3200, "saturday");
~~~


# GROUP BY

~~~klipse-sql
SELECT game, sum(points) as total_points FROM play GROUP BY game
~~~

# HAVING vs. WHERE

`WHERE` is for columns that are part of the table.

~~~klipse-sql
SELECT game, points FROM play WHERE points > 10
~~~

`HAVING` is for examinating the results of aggregation functions.

~~~klipse-sql
SELECT game, sum(points) as total_points FROM play GROUP BY game HAVING total_points > 10
~~~
