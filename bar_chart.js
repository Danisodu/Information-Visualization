const sample = [
  {
    language: 'Heroin',
    value: 175,
    color: '#007bc8'
  },
  {
    language: 'Cocaine',
    value: 110,
    color: '#00a2ee'
  },
  {
    language: 'Meth',
    value: 80,
    color: '#507dca'
  },
  {
    language: 'Crack',
    value: 75,
    color: '#fbcb39'
  },
  {
    language: 'Ketamine',
    value: 25,
    color: '#ff6e52'
  },
  {
    language: 'PCP',
    value: 25,
    color: '#f9de3f'
  },
  {
    language: 'Ecstasy',
    value: 20,
    color: '#65cedb'
  },
  {
    language: 'Mushrooms',
    value: 20,
    color: '#5d2f8e'
  },
  {
    language: 'Marijuana',
    value: 15,
    color: '#000000'
  },
  {
    language: 'LSD',
    value: 12.5,
    color: '#008fc9'
  },
];

const svg = d3.select('svg');
const svgContainer = d3.select('#container');

const margin = 80;
const width = 600 - 2 * margin;
const height = 600 - 2 * margin;

const chart = svg.append('g')
  .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleLinear()
  .range([height, 0])
  .domain([200, 0]);

const yScale = d3.scaleBand()
  .range([0, width])
  .domain(sample.map((s) => s.language))
  .padding(0.4)

// vertical grid lines
// const makeXLines = () => d3.axisBottom()
//   .scale(xScale)

const makeXLines = () => d3.axisBottom()
  .scale(xScale)

chart.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

chart.append('g')
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
  .attr('class', 'bar')
  .attr('x', (g) => 0)
  .attr('y', (g) => yScale(g.language))
  .attr('width', (g) => xScale(g.value))
  .attr('height', yScale.bandwidth())


  //esteves
 .on('click', function () {

    d3.selectAll('rect')
      .style('fill', "#80cbc4")

    d3.select(this)
      .style('fill', 'green')
      .attr('opacity', 0.6)


  })


  .on('mouseenter', function (actual, i) {
    d3.selectAll('.value')
      .attr('opacity', 0)

    d3.select(this)
      .transition()
      .duration(300)
      .attr('opacity', 0.6)
      .attr('y', (a) => yScale(a.language) - 5)
      .attr('height', yScale.bandwidth() + 10)

    const x = xScale(actual.value)

    line = chart.append('line')
      .attr('id', 'limit')
      .attr('y1', 0)
      .attr('x1', x)
      .attr('y2', width)
      .attr('x2', x)

    barGroups.append('text')
      .attr('class', 'divergence')
      .attr('x', (a) => xScale(a.value) + 30)
      .attr('y', (a) => yScale(a.language) + yScale.bandwidth() / 1.6)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text((a, idx) => {
        const divergence = (a.value - actual.value).toFixed(1)

        let text = ''
        if (divergence > 0) text += '+'
        text += `${divergence}$`

        return idx !== i ? text : '';
      })

  })
  .on('mouseleave', function () {
    d3.selectAll('.value')
      .attr('opacity', 1)

    d3.select(this)
      .transition()
      .duration(300)
      .attr('opacity', 1)
      .attr('x', (g) => 0)
      .attr('y', (g) => yScale(g.language))
      .attr('width', (g) => xScale(g.value))
      .attr('height', yScale.bandwidth())

    chart.selectAll('#limit').remove()
    chart.selectAll('.divergence').remove()


  })



//barGroups
  //.append('text')
  //.attr('class', 'value')
  //.attr('x', (a) => xScale(a.value) - 20)
  //.attr('y', (a) => yScale(a.language) + yScale.bandwidth() / 1.6)
  //.attr('text-anchor', 'middle')
  //.text((a) => `${a.value}$`)

svg
  .append('text')
  .attr('class', 'label')
  .attr('x', -(height / 2) - margin)
  .attr('y', margin / 7)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .text('Drugs')

svg.append('text')
  .attr('class', 'label')
  .attr('x', width / 2 + margin)
  .attr('y', height + margin * 1.7)
  .attr('text-anchor', 'middle')
  .text('Price per gram(\$)')

svg.append('text')
  .attr('class', 'title')
  .attr('x', width / 2 + margin)
  .attr('y', 40)
  .attr('text-anchor', 'middle')
  .text('Drug\'s average price per gram')
