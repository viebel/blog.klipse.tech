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
klipse_editor_type: "html"
local_klipse: true
---

# SQL

From today, we can run SQL queries with KLIPSE.

~~~klipse-sql
CREATE TABLE play (game, points, day)
~~~

~~~klipse-sql
INSERT INTO play VALUES ("go", 500, "monday");
INSERT INTO play VALUES ("go", 300, "tuesday");
INSERT INTO play VALUES ("chess", 1250, "tuesday");
INSERT INTO play VALUES ("chess", 1250, "tuesday");
INSERT INTO play VALUES ("chess", 50, "sunday");
INSERT INTO play VALUES ("chess", 3200, "saturday");
~~~

~~~klipse-sql
SELECT game, sum(points) as total_points FROM play GROUP BY game HAVING total_points > 10000
~~~



