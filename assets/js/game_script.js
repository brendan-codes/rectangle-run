(function(){

    var active = true;
    var score = 0;
    var floor_speed = 7;

  // -------- GLOBAL FUNCTIONS
    function makeSVG(tag, attrs) {
         var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
         for (var k in attrs)
             el.setAttribute(k, attrs[k]);
         return el;
    }

    function getTime(){
      var date = new Date();
      return date.getTime();
    }
    // ---------- END OF GLOBAL FUNCTIONS


    // ---------- HERO CONSTRUCTOR + METHODS

    // --- hero CONSTRUCTOR
    // -- constructs hero
    // -- data is hardcoded
    var Hero = function HeroConstructor(){
      this.info = {
                    name: 'our_hero',
                    x: 100,
                    y: 350,
                    height: 40,
                    width: 20,
                    jumping: null,
                    j_strength: 25,
                    j_start: null,
                    j_decay: 0.2,
                    velocity: {
                                x: 0,
                                y: 0
                              }
                  };
       this.current_time;
    };

    // --- hero draw
    // -- draws hero to HTML and creates SVG element
    // -- takes no input, works off of Hero object
    Hero.prototype.draw = function(){
      var hero_parts = {
                         name: this.info.name,
                         id: this.info.name,
                         x: this.info.x,
                         y: this.info.y,
                         width: this.info.width,
                         height: this.info.height,
                         fill: 'red'
                        }
      var temp = makeSVG('rect', hero_parts);
      document.getElementById('world').appendChild(temp);
    };

    // --- hero TIMER
    // -- used for jump calculation, constant timestamp
    Hero.prototype.timer = function(){
      this.current_time = getTime();
    }

    Hero.prototype.update = function(){
      var current_y = parseInt($('#' + this.info.name).attr('y'));

      if(this.info.jumping){

        var temp = (this.current_time - this.info.j_start) / 10;
        var temp2 = ((temp - 25) / 100) * -1;
        var temp3 = temp2 * 2;
        if(temp3 < 0.15){
          temp3 = 0.15;
        }
        this.info.j_decay = temp3;
      }

      this.info.velocity.y += this.info.j_decay;

      //console.log(this.info.j_decay);


      //$('#' + this.info.name).attr('x', current_x + this.info.velocity.x);
      $('#' + this.info.name).attr('y', current_y + this.info.velocity.y);
      this.info.y = current_y + this.info.velocity.y;
    };

    var World = function WorldConstructor(){
      //this.current_time;
      this.info = {
                    height: 500,
                    width: 1000,
                    floor_counter: 1
                  };

      this.floors = [
                      {
                        info: {
                               name: 'floor0',
                               id: 'floor0',
                               x: 0,
                               y: 450,
                               height: 40,
                               width: 1100,
                               fill: 'green'
                             },
                        velocity: {
                              x: floor_speed
                            },
                        gap: 250,
                        ungapped: true
                      }
                    ];

      var startpart = this.floors[0].info;
      var temp = makeSVG('rect', startpart);
      document.getElementById('world').appendChild(temp);
    }

    var Floor = function FloorConstructor(name){

      var rand_w = Math.floor(Math.random() * 301) + 100;
      var rand_h = Math.floor(Math.random() * 151);
      var new_y = 450 - rand_h;

      this.info = {
        name: name,
        id: name,
        x: 1000,
        y: new_y,
        height: 40,
        width: rand_w,
        fill: 'green'
      };
    }




    Floor.prototype.draw = function(){
      var startpart = this.info;
      //this.floors.push(startpart);
      var temp = makeSVG('rect', startpart);
      document.getElementById('world').appendChild(temp);
    }

    World.prototype.update = function(hero){
      score++;
      $('#score').html(score);

    //  console.log(hero.info.jumping);

      for(floor in this.floors){

        var cur = this.floors[floor];
        var floor_x = $('#' + cur.info.name).attr('x');
        var hero_y = $('#' + hero.info.name).attr('y');
        var hero_h = $('#' + hero.info.name).attr('height');

        // if(score == 1000){
        //   floor_speed++;
        // }
        //
        // if(score == 2000){
        //   floor_speed++;
        // }
        //
        // if(score == 3000){
        //   floor_speed++;
        // }

        //actual updates
        $('#' + cur.info.name).attr('x', floor_x - cur.velocity.x);
        cur.info.x -= cur.velocity.x;

        //creation check
        if(cur.ungapped){
          if(cur.info.x + cur.info.width + cur.gap < 1000){
            var new_floor = new Floor('floor' + this.info.floor_counter++);
            //console.log(new_floor.info);
            new_floor.draw();
            cur.ungapped = false;
            var gap_size = Math.floor(Math.random() * 201) + 100;
            //var random_speed = Math.floor(Math.random() * 4) + ;
            this.floors.push({info: new_floor.info, velocity: {x: floor_speed}, gap: gap_size, ungapped: true})
          //  console.log(this.floors);
          }
        }
        //deletion check
        if(cur.info.x + cur.info.width + cur.gap <= 0){
          $('#' + cur.info.name).remove();
          this.floors.shift();
          //console.log(this.floors);
        }

        // floor check
        if(cur.info.x < 110 && cur.info.x + cur.info.width > 90){
          if(hero_y + hero_h > cur.info.y - cur.info.height && hero_y + hero_h < cur.info.y){
              hero.info.velocity.y = 0;
              $('#' + hero.info.name).attr('y', cur.info.y - hero_h);
              hero.info.jumping = null;
          }
        }

        if(hero.info.y > 600){
          console.log('DEADED')
          window.clearInterval(main_interval);
          active = false;
        }

        // gap check
        //console.log(cur.info.x + cur.info.width);
        // if(!(cur.info.x < 110) && !(cur.info.x + cur.info.width > 90)){
        //   console.log('TEST1');
        //   if(hero_y + hero_h > cur.info.y - cur.info.height){
        //     hero.info.velocity.y = 20;
        //     console.log('TEST2');
        //   }
        //   if(hero.info.velocity.y === 0){
        //     console.log('TEST3');
        //     hero.info.velocity.y = 20;
        //   }
        // }
        //var floor_x = $('#' + this.floors[floor].info.id)
      }
    }


    var hero1 = new Hero();
    var world1 = new World();

    hero1.draw();
    world1.update(hero1);
    //floor1.drawStart();


    function gameLoop(){
      hero1.timer();
      hero1.update();
      world1.update(hero1);
    }




    document.onkeydown = function(e){

      //console.log(e.keyCode);

      if(!active){
        if(e.keyCode === 13){
          console.log('deaded!');
          score = 0;
          active = true;
          document.getElementById('world').innerHTML = '';
          delete hero1;
          delete world1;
          //floor_speed = 5;
          hero1 = new Hero();
          world1 = new World();
          hero1.draw();
          main_interval = setInterval(gameLoop, 15);
        }
      }

      if(active){
        if(e.keyCode === 32){
          //console.log('test');
          //test++;
          if(!hero1.info.j_start){
            hero1.info.j_start = getTime();
          }
          //console.log(mousedown_time);
          if(!hero1.info.jumping){
            //mousedown_time = getTime();
            if(hero1.info.velocity.y == 0){
              //console.log('TEST')
              hero1.info.velocity.y = -10;
            }
            hero1.info.jumping = true;

          }
        }
      }


    };

    document.onkeyup = function(e){

      if(e.keyCode === 32){

        hero1.info.jumping = null;
        hero1.info.j_start = null;

      }
    }

    var main_interval = setInterval(gameLoop, 15);

    //console.log(interval);

  // document.onkeydown = function(e){
  //   if(e.keyCode === 32){
  //     //console.log('test');
  //     //console.log(Interval);
  //   }
  // }


})();
