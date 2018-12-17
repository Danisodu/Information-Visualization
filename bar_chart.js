const sample = [
  {
    language: 'Heroin',
    value: 175,
  },
  {
    language: 'Cocaine',
    value: 110,
  },
  {
    language: 'Meth',
    value: 80,
  },
  {
    language: 'Crack',
    value: 75,
  },
  {
     language: 'Inhalant',
     value: 15,
   },
   {
     language: 'Stimulant',
     value: 15,
   },
   {
     language: 'Sedative',
     value: 15,
   },
   {
     language: 'Marijuana',
     value: 15,
   },
   {
     language: 'PainReliever',
     value: 15,
   },
   {
     language: 'Hallucinogen',
     value: 10,
   },
   {
     language: 'Tranquilizer',
     value: 5,
   }
];

const svg = d3.select("#bar_chart").append('svg');
var shite = null;

const margin = 100;
const width = 600 - 3 * margin;
const height = 600 - 3 * margin;

const chart = svg.append('g')
  .attr('transform', `translate(${margin}, 50)`);

const xScale = d3.scaleLinear()
  .range([height, 0])
  .domain([180, 0]);

const yScale = d3.scaleBand()
  .range([0, width])
  .domain(sample.map((s) => s.language))
  .padding(0.2)

// vertical grid lines
// const makeXLines = () => d3.axisBottom()
//   .scale(xScale)

const makeXLines = () => d3.axisBottom()
  .scale(xScale)

chart.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

chart.append('g')
  .attr("class","yLabel")
  .call(d3.axisLeft(yScale));

// vertical grid lines
// chart.append('g')
//   .attr('class', 'grid')
//   .attr('transform', `translate(0, ${height})`)
//   .call(makeXLines()
//     .tickSize(-height, 0, 0)
//     .tickFormat('')
//   )

chart.append('g')
  .attr('class', 'grid')
  .call(makeXLines()
    .tickSize(height, 0, 0)
    .tickFormat('')
  )

const barGroups = chart.selectAll()
  .data(sample)
  .enter()
  .append('g')

barGroups
  .append('rect')
  .attr('class', function(d,i){return 'bar bar' + i;})
  .attr('x', (g) => 1)
  .attr('y', (g) => yScale(g.language))
  .attr('width', (g) => xScale(g.value))
  .attr('height', yScale.bandwidth())
  .on('click', function (actual) {

    updateDrug(actual.language);
    if (shite !== null) {
      shite.style('fill', "#c7e9b4");
    }

    d3.select(this)
      .style('fill', '#225ea8')

    shite = d3.select(this)
  })

  .on('mouseenter', function (actual, i) {
    chart.select(".yLabel").selectAll("g").select("text").classed("text-highlight",function(c,ci){ return ci==i;});

    d3.selectAll('.value')
      .attr('opacity', 0)

    d3.select(this)
      .transition()
      .duration(300)
      .attr('opacity', 0.4)

    const x = xScale(actual.value)

    line = chart.append('line')
      .attr('id', 'limit')
      .attr('y1', 0)
      .attr('x1', x)
      .attr('y2', width)
      .attr('x2', x)

    barGroups.append('text')
      .attr('class', 'divergence')
      .attr('x', (a) => xScale(a.value) + 28)
      .attr('y', (a) => yScale(a.language) + yScale.bandwidth() / 1.4)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text((a, idx) => {
        const divergence = (a.value - actual.value).toFixed(1)

        let text = ''
        if (divergence > 0) text += '+'
        text += `${divergence}$`

        return idx !== i ? text : actual.value + '$';
      })

  })
  .on('mouseleave', function () {
    d3.selectAll('.value')
      .attr('opacity', 1)

    chart.selectAll("g").select("text").classed("text-highlight",false);

    d3.select(this)
      .transition()
      .duration(300)
      .attr('opacity', 1)

    chart.selectAll('#limit').remove()
    chart.selectAll('.divergence').remove()


  })

svg.select('.bar0').style('fill', '#225ea8')
shite = d3.select('.bar0')

svg.append('text')
  .attr('class', 'title')
  .attr('x', width / 2 + margin)
  .attr('y', 20)
  .attr('text-anchor', 'middle')
  .text('Drug\'s average price per gram in USD')
