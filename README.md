# Drug Consumption in the USA: A Data Analysis and Visualization

This project was developed in the context of the Information Visualization course project, made by Daniela Duarte, João Alves and João Esteves, from Instituto Superior Técnico (Lisbon).
The goal was to make use of data visualization techniques to analyse and explore data in a interactive way, and obtain insights. 
Specifically, the drug consumption habits of American citizens was studied, and it was 
intented to complete the following tasks:

* Find drug prices and compare them;
* Get demographic information distribution for each user type;
* Find the comsumption association between drugs;
* Get the distribution of users that verify certain demographic characteristics.


## Data
The dataset used in this study concerns [drug consumption habits in the USA](https://data.world/balexturner/drug-use-employment-work-absence-income-race-education), 
and it was also the information of [drug prices](https://www.dnalegal.com/drugs-menu).



The dataset was processed in the following manner:
1. Removal of columns that were irrelevant for our visualization.
2. Removal of rows containing erroneous data.
3. Derive a new column attribute called type of user.

## Visualization Techniques
Our solution is composed of four idioms: 

* A [bar
chart](https://blog.risingstack.com/d3-jstutorial-bar-charts-with-javascript/) with prices for several drugs;
* An heatmap relating types
of drug users with demographic information;
* A [node pie](https://bl.ocks.org/kgeorgiou/68f864364f277720252d0329408433ae) associating
different drugs and showing the user types distribution;
* [Parallel sets](https://www.jasondavies.com/parallel-sets/) crossing demographic information.

We chose a master-slave approach to our solution, the master
being the bar chart and all others being the slaves. This means
that by clicking on a bar, the correspondent drug will propagate
to all other idioms, showing only information about that
drug.


