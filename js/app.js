var Chrome = VueColor.Chrome;


var app = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  components: {
    'chrome-picker': Chrome
  },
  data: {
    choose_color: '',
    choose_index: -1,
    simulation_state: false,
    simulation_label: 'Lancer la simulation',
    colorpicker: '',
    imported_data: '',
    timestep: 1000,
    exported_data: '',
    r1: 25,
    r2: 0,
    r3: 0,
    colors: ['#FF0000', '#00FF00', '#0000FF', '#4286F4', '#A31F9C', '#4DA21E',
            '#594E40', '#000000', '#112C30', '#24196D', '#18686D'],
    current_colors: [0, 1, 2],
  }
,
methods: {
  render: function() {
    var c=document.getElementById("canvas");
    var ctx=c.getContext("2d");

    ctx.fillStyle=this.colors[this.current_colors[0]];
    ctx.beginPath();
    ctx.arc(100,100,100,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle=this.colors[this.current_colors[1]];
    ctx.beginPath();
    ctx.arc(100,100,this.r3,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle=this.colors[this.current_colors[2]];
    ctx.beginPath();
    ctx.arc(100,100,this.r2,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle=this.colors[this.current_colors[0]];
    ctx.beginPath();
    ctx.arc(100,100,this.r1,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
  },
  compute: function() {
    this.r2 = 100 * Math.sqrt((3.0*(this.r1/100)*(this.r1/100) + 1.0)/3.0);
    this.r3 = 100 * Math.sqrt((3.0*(this.r1/100)*(this.r1/100) + 2.0)/3.0);
  },
  range: function() {
    this.compute();
    this.render();
  },
  up: function(i) {
    var array = this.colors;
    this.colors = '';
    if (i !== 0) {
      var temp = array[i-1];
      array[i-1] = array[i];
      array[i] = temp;
    } else {
      var temp = array[0];
      array[0] = array[array.length - 1];
      array[array.length - 1] = temp;
    }
    this.colors = array;
    this.render();
  },
  down: function(i) {
    var array = this.colors;
    this.colors = '';
    if (i !== array.length - 1) {
      var temp = array[i+1];
      array[i+1] = array[i];
      array[i] = temp;
    } else {
      var temp = array[0];
      array[0] = array[array.length - 1];
      array[array.length - 1] = temp;
    }
    this.colors = array;
    this.render();
  },
  export_data: function()
  {
    this.exported_data =
    {
      r1: this.r1,
      colors: this.colors,
      timestep: this.timestep
    }
  },
  import_data: function()
  {
    this.choose_index == -1;
    var json = JSON.parse(this.imported_data);
    this.r1 = json.r1;
    this.compute();
    this.colors = json.colors;
    this.timestep = json.timestep;
    this.render();
  },
  simulation: function()
  {
    if (this.simulation_state) {
      this.simulation_state = false;
      this.simulation_label = "Lancer la simulation";
    } else {
      this.simulation_state = true;
      this.simulation_label = "Stopper la simulation"
      this.launch();
    }
  },
  launch: function() {
    if (this.simulation_state) {
      this.current_colors[0] = (this.current_colors[0] + 7)%11;
      console.log(this.current_colors[1] === this.current_colors[0]);
      this.current_colors[1] = (this.current_colors[1] + 19)%11;
      while (this.current_colors[1] === this.current_colors[0]) {
        this.current_colors[1] = (this.current_colors[1] + 19)%11;
      }
      this.current_colors[2] = (this.current_colors[2] + 13)%11;
      console.log(this.current_colors[2] === this.current_colors[0] || this.current_colors[2] === this.current_colors[1]);
      while (this.current_colors[2] === this.current_colors[0] || this.current_colors[2] === this.current_colors[1]) {
        this.current_colors[2] = (this.current_colors[2] + 13)%11;
      }
      if (this.colors[0] !== this.colors[1] && this.colors[1] !== this.colors[2]) {
        this.render();
        setTimeout(this.launch, this.timestep)
      } else {
        this.launch()
      }

    }
  },
  edit_color: function(i) {
    if (this.choose_index !== i) {
      this.choose_index = i;
      var arr = this.colors;
      this.colors = arr;
      this.choose_color = this.colors[this.choose_index]
    } else {
      this.choose_index = -1
    }
  },
  save: function(i) {
    if (this.colors[i] !== this.choose_color) {
      this.colors[i] = this.choose_color.hex;
      this.render();
    }
    this.choose_index = -1;
  }
}
,
mounted: function() {
  this.compute()
  this.render()
  console.log(this.choose_color);
},
})
