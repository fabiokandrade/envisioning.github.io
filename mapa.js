

var width = 1300,
    height = 1100;
var imageDirBase = 'assets/nodes/'
var horaInicio = 0;
var horaFim = 12;
var peso1 = 1;

var orbitRadius = 300; //a órbita será única em todos os estados?
var center= {x: width / 2, y:height / 2};
var margin= {top: 40};

var svg = d3.select('body').select('div#svg').append('svg').attr("width",width).attr("height",height)

var orbit = svg.append("circle").attr('class','orbit').attr({cx:center.x-300, cy: orbitRadius + margin.top, r: orbitRadius}).attr('opacity','0')
var orbitCenter= {x: svg.select(".orbit").attr('cx'), y: svg.select(".orbit").attr('cy')};

var state = {center:'central', logo:false};
var larg = 8;

var transitionRedrawTime = 400;

svg.append('defs')
	.append("clipPath").attr('id',"clip-pessoa")
	.append("circle").attr({cx: "60", cy:"60", r:"55"})

// Entity	Photo	Slogan	Slogan-PT	Description	Description-PT	People	Permalink	Twitter	Linked	Partners	Photo
  // TIPOs: node, profile, project
var    nucleus = [{id:"disrupting", tipo: "node",label:"Disrupting" , image:"disrupting.svg", people:["AK", "AS"], peso:1},
              {id:"futurekit" ,tipo: "node",label:"FUTUREKIT" ,  image:"futurekit.svg", people:["AK"], peso:1},
              {id:"futuredeck" ,tipo: "node",label:"FUTUREDECK" , image:"futuredeck.svg", people:["AK"], peso:1},
              {id:"fyfs" ,tipo: "node",label:'FYFS' , image:"fyfs.svg", people:"", peso:1},
              {id:"fashxtech" ,tipo: "project",label:"FASHTECH" , image:"fashxtech.svg", people:"", peso:1},
              {id:"readinessradar" ,tipo: "project",label:"READINESS RADAR" , image:"readiness.svg", people:"", peso:1},
              {id: "everythingisaccelerating" ,tipo: "profile",label:"EVERYTHING IS ACCELERATING", image:"eia.svg", people:"", peso:1},
              {id:"envisioningeducation" ,tipo: "profile",label:"ENVISIONING EDUCATION" , image:"education.svg", people:"", peso:1},
              {id:"fuckyeahfutureshock" ,tipo: "profile",label:"F-YEAH FUTURESHOCK!" , image:"pessoa.svg", people:"", peso:1}];
console.log(nucleus);
//Photo	Person	Bio	City	Short	URL	Photo-URL
var    people = [
{id:"AK" ,label:"Alexander Kustov" , bio:"", city: "", url:"", photo_url:"http://i.imgur.com/JFAPdUX.png"},
{id:"AS" ,label:"Arthur Soares" , bio:"", city: "", url:"", photo_url:"http://i.imgur.com/7WQTY5I.png"}

];





function makeLinks(nucleus){
   //acha o nucleos
   //pega a array de people
   //para cara person:
   //acha person
   //grava nucleo.id
   return [{source:'futurekit', target:'futuredeck'},
   		   {source:'envisioningeducation', target:'fuckyeahfutureshock'},
   		   {source:'futurekit', target:'fuckyeahfutureshock'},
   		   {source:'fashxtech', target:'fuckyeahfutureshock'},
   		   {source:'everythingisaccelerating', target:'disrupting'},
   		   {source:'readinessradar', target:'disrupting'},
   		   {source:'readinessradar', target:'fyfs'}
   		   ]
   
}

var links = makeLinks('teste');
var mapLinksTS = {};
d3.map(links).forEach(function(k,value){
typeof mapLinksTS[value.target] == 'undefined' ? mapLinksTS[value.target] = [ value.source] : mapLinksTS[value.target].push(value.source);

typeof mapLinksTS[value.source] == 'undefined' ? mapLinksTS[value.source] = [ value.target] : mapLinksTS[value.source].push(value.target);
})

function getItemPosition(itemID){
	var item = d3.select('#'+itemID+' use');
return {x: parseFloat(item.data()[0].Nx), y: parseFloat( item.data()[0].Ny), peso: parseFloat( item.data()[0].peso) }
}


// substituir 9 pelo total
var divideHoras = d3.scale.linear().domain([0, 9]).range([0, 12]);
var radianosHoras = d3.scale.linear().domain([0, 12]).range([0, 2 * Math.PI]);
var radianosAngulo = d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI]);

var dimpeso = d3.scale.linear().domain([1, 3]).range([1,1.5]);

	function getCirclePosition(d,horas){
		var a = radianosHoras(horas-3)
		var pt = {};
		/*
		d = círculo origem
		x = cx + r * cos(a)
		y = cy + r * sin(a)
		r é o raio, cx,cy o centro, e a o angle (0..2PI radianos ou 0..360 graus)
		*/

		var cx = parseFloat(d.attr("cx"));
		var cy = parseFloat(d.attr("cy"));
		var r = parseFloat(d.attr("r")) ;
		

		pt.x = cx + r * Math.cos(a);
		pt.y = cy + r * Math.sin(a);
		
		return pt
	}




function buildHome(){

var home = svg.append('g').attr("class","nodes").selectAll("g")
	.data(nucleus)
	.enter()
	.append('g')
	.attr('id', function(d,i){return d.id})
	.attr("class", function(d,i){return "node tipo_"+d.tipo+" "+mapLinksTS[d.id].join(' ')})
		.append("use")
      	.attr("xlink:href", function(d) {handleImage(d.image); return "#def_" + d.image.substr(0,d.image.length-4); } )
      	.attr("x",function(d,i){d.Nx = getCirclePosition(orbit, i ).x; return d.Nx})
		.attr("y",function(d,i){d.Ny = getCirclePosition(orbit, i ).y; return d.Ny});
return home;
      	}


function makeLabels(){
	var labelsText = d3.selectAll('.node')
		.data(nucleus).append("text")
		.attr('class','label')
     	.attr("text-anchor", "middle")
     	.attr('transform','translate(60,60)')
     	.text(function(d) {
       		return d.label;
      	});

    //  var textos = labelsText.selectAll("tspan")
    // 			.data(function(d) { return d.label.split('|'); })
    // 			.enter()
    // 			.append("tspan")
				// .attr("dx", function(d){console.log (this.parentNode); return this.parentNode.attributes.x.value})
    // 			.attr('dy', '15')
				// .text(function(dt,i) {
    //    				return dt;
    //   			});

     return labelsText;
}

function positionLabels(){
	labels.attr("x",function(d,i){return d.Nx})
		  .attr("y",function(d,i){return d.Ny})
		  .attr('transform',function(d){
		  	var fatorPosTexto;
		  	var anchorText;
			//se x > ou < que center.x
			if (d.Nx < parseInt(orbit.attr('cx'))){
				fatorPosTexto = -65 + (60*dimpeso(d.peso));
			} else {
				fatorPosTexto = 65 + (60*dimpeso(d.peso))
			}
		  		//console.log(d.Nx + '/'+center.x+' ' +fatorPosTexto);
		  		return 'translate('+fatorPosTexto+','+60+')'
		  	})
		  .attr("text-anchor", function(d){
		  	if (d.Nx < parseInt(orbit.attr('cx'))){
				return 'end'
			} else {
				return 'start'
			}
		  })
		  .transition().delay(transitionRedrawTime+100).duration(50)
		  .style("opacity", 1);

 
}

function appensLines(){
	var nodes = Array.prototype.slice.call(tmp.childNodes)                 //create a real array from the childNodes variable
	nodes.forEach( function(node) {
    text.append("tspan")
        .attr("style", node.getAttribute && node.getAttribute("style"))
        .text(node.textContent)
	})
}

function moveDivide(selection, range, doredraw){
	range = typeof range !== 'undefined' ? range : [0,12];
	selection = typeof selection !== 'undefined' ? selection : svg.selectAll("g.node use");
	doredraw = typeof doredraw !== 'undefined' ? doredraw : true;


	var divideHorasRange = d3.scale.linear().domain([0, selection.size()]).range(range);

	selection
	.attr("Nx",function(d,i){d.Nx = getCirclePosition(orbit, divideHorasRange(i) ).x})
	.attr("Ny",function(d,i){d.Ny = getCirclePosition(orbit, divideHorasRange(i) ).y})
	if (doredraw){
	return redraw();
	}
}

function redraw(itemID,t0){
itemID = typeof itemID !== 'undefined' ? itemID : false;

 var t0 = typeof t0 !== 'undefined' ? t0 : svg.transition().duration(transitionRedrawTime);
 

    
t0.selectAll("g.node use")
	.attr("x",function(d,i){return d.Nx})
	.attr("y",function(d,i){return d.Ny})
	.attr('transform', function(d){if(d.peso == 0) {return rescale(d.Nx,d.Ny,0)}else{ return rescale(d.Nx,d.Ny,dimpeso(d.peso)) }})
//t0.selectAll('.connector path').attr('d',function(d,i){return line([getItemPosition(d.source),getItemPosition(d.target)])});

t0.selectAll('.newconnector path').attr('d',function(d,i){return getPathConnection (d.source,d.target,itemID)});
//t0.each('start',function(){labels.style("opacity", 0)});
//t0.each('end',function(){positionLabels()});
positionLabels();
return t0;
}



function moveOne(itemID, horas, refOrbit, doRedraw){
	doRedraw = doRedraw==false ? false : true;
	console.log(doRedraw);
var itemData = svg.select('#'+itemID).data()[0];
	itemData.Nx= getCirclePosition(refOrbit, horas ).x;
	itemData.Ny= getCirclePosition(refOrbit, horas ).y;
	if (doRedraw===true){
	redraw();
	}else{
		labels.style("opacity", 0);
	}
	return true;
}	

function shrink(itemID){
	
	var t0 = svg.transition().duration(750);
    
t0.selectAll("g.node use").filter(function (d) { return d.id != itemID; })
	.attr("x",function(d,i){d.Nx=350+i; return d.Nx})
	.attr("y",function(d,i){d.Ny=340+i; return d.Ny})
	.attr('transform', function(d){d.peso=0; return rescale(d.Nx,d.Ny,0) })
//t0.selectAll('.connector path').attr('d',function(d,i){return line([getItemPosition(d.source),getItemPosition(d.target)])});
t0.selectAll('.newconnector path').style('opacity',0);
t0.selectAll('.newconnector path').attr('d',function(d,i){return getPathConnection (d.source,d.target)});
return t0;
}

function unshrink(itemID){
	
	svg.selectAll("g.node use")
	.attr("peso",function(d,i){d.peso=1;});
	
	moveDivide().each('end',function(){svg.selectAll('.newconnector path').transition().duration(400).style('opacity',1);});
	}

function handleImage(image){
// if jpg...
// if http ou imageDirBase
addDefSvg(image,imageDirBase)

}


//d3.selectAll("use").transition().duration(1000).attr("x",function(d,i){return getCirclePosition(central, i ).x}).attr("y",function(d,i){return getCirclePosition(central, i ).y});



function addDefSvg(svgFileFrom, dirbase){
dirbase = dirbase ? dirbase : ""
var	id = svgFileFrom.substr(0,svgFileFrom.length-4)
var s = d3.select('defs').append('g').attr('id','def_'+id)

jQuery( "#def_"+id ).load( dirbase+svgFileFrom +" svg > *", function() {
  //Load was performed
});
return s;
}



function addCenter(id){

}


function remove(){
	svg.selectAll("g.node use")
	.data(nucleus).exit().transition().duration(5000).attr('x',orbit.attr('cx')).attr('y',orbit.attr('cy')).remove()
}


function pointDist(ptA,ptB){
	//{x:,y:}
	return Math.sqrt( Math.pow((ptB.x - ptA.x),2) + Math.pow(ptB.y-ptA.y,2) )
}

function pointHalf(ptA,ptB){
	//{x:,y:}
	return {x: (parseFloat(ptB.x) + parseFloat(ptA.x))/2,
	        y: (parseFloat(ptB.y) + parseFloat(ptA.y))/2};
}

function coefAngular(ptA,ptB){
	return  (ptB.y-ptA.y)/(ptB.x - ptA.x) 
}


function getAngle(coef){
	
	var rad2deg = 180/Math.PI;
	var degrees = Math.atan( coef ) * rad2deg;
	
	return degrees;
}


	var line = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; })
		.interpolate("basis");

function makeConnections(){
var lk = svg.append('g').attr('class','newconnector').selectAll('g').data(links).enter()
.append('path')
.attr('d',function(d,i){return line([getItemPosition(d.source),getItemPosition(d.target)])})
.attr('transform','translate(60,60)')
.attr("stroke", "white")
.attr("stroke-width", 5)
.attr("fill", "none");
return lk;
}

function updateConnections(){
svg.selectAll('.connector path')
	.attr('d',function(d,i){return line([getItemPosition(d.source),getItemPosition(d.target)])})
	
}



function buildCenter(itemID){
	state.center = itemID;
	var item = svg.select('#'+itemID);
	var itemData = item.data()[0];
	//moveDivide()

	var t0 = shrink(itemID)
	var t1 = t0.transition().duration(2000).delay(1000).call(function(){
	console.log('ponto');
		itemData.Nx= orbit.attr('cx');
		itemData.Ny= orbit.attr('cy');
		itemData.peso = 7;
		console.log('teste')
		labels.style("opacity", 0)
		//item.selectAll('use').transition().duration(600)
		//.attr("x",function(d,i){return d.Nx})
		//.attr("y",function(d,i){return d.Ny})
		//.attr('transform', function(d2){console.log(rescale(d2.Nx,d2.Ny,dimpeso(d2.peso))); return rescale(d2.Nx,d2.Ny,dimpeso(d2.peso)) })
	
	})
	setTimeout(function(){ 
	var t2n = item.transition().duration(1000).call(function(){redraw()});
	},600)
	
	setTimeout(function(){ 
	var t3 = item.transition().duration(2000).call(function(){
			// muda conteúdo do centro. textos, etc...
			
			
			svg.selectAll('div.texto').html(itemData.label);
			moveOne(itemID,0,svg.select('.circlecenter'),false);
			itemData.peso = 1;
 			item.selectAll('use').transition(1000).duration(600)
			.attr("x",function(d,i){return d.Nx})	
			.attr("y",function(d,i){return d.Ny})
			.attr('transform', function(d){return rescale(d.Nx,d.Ny,dimpeso(d.peso)) });
			//return redraw();
		    })
	},1000)
	setTimeout(function(){ 
		var t4 = item.transition().duration(3000).delay(1000).call(function(){restoreFromCenter(itemID);});
	 }, 1200);
	
	
	//.each("end",restoreFromCenter(itemID));
	
	return itemID
}


 function	unbuildCenter(itemID){

 	itemID = itemID ? itemID : state.center
 	var item = svg.select('#'+itemID);
	var itemData = item.data()[0];
	itemData.Nx= orbit.attr('cx');
		itemData.Ny= orbit.attr('cy');
		itemData.peso = 7;
	redraw().each('end', function(){
	svg.selectAll('div.texto').html('centro');
	unshrink();
})

 }

function restoreFromCenter(itemID){
	itemID = itemID ? itemID : state.center;

	var selection =	svg.selectAll("g."+itemID+" use")
	//.filter(function (d) {return mapLinksTS[d.id].some(function(d){return d == itemID;})  })
	.attr("peso",function(d,i){d.peso=1;});

	//moveDivide(svg.selectAll("g.tipo_profile."+itemID+":not(#"+itemID+") use"),[2,4.9],false);
	//moveDivide(svg.selectAll("g.tipo_node."+itemID+":not(#"+itemID+") use"),[7.1,11],false);
	//moveDivide(svg.selectAll("g.tipo_project."+itemID+":not(#"+itemID+") use"),[5,7],false);

	moveDivide(svg.selectAll("g.tipo_profile."+itemID+" use"),[2,4.9],false);
	moveDivide(svg.selectAll("g.tipo_node."+itemID+" use"),[7.1,11],false);
	moveDivide(svg.selectAll("g.tipo_project."+itemID+" use"),[5,7],false);


	redraw(itemID)
	.each('end',
		function(){svg.selectAll('.newconnector path').transition().duration(400).style('opacity',1);}
		);
	

}



function rescale(x,y,scale){

var transIcone = 60 * -1 * (scale - 1);
var transX = x * -1 * (scale - 1);
var transY = y * -1 * (scale - 1);
return 'translate('+transIcone+','+transIcone+') translate('+transX+','+transY+') scale('+scale+')';
}


function getCirclePositionR(d,angulo){
		var a = radianosAngulo(angulo)
		var pt = {};
		/*
		d = círculo origem
		x = cx + r * cos(a)
		y = cy + r * sin(a)
		r é o raio, cx,cy o centro, e a o angle (0..2PI radianos ou 0..360 graus)
		*/

		

		pt.x = d.cx + d.r * Math.cos(a);
		pt.y = d.cy + d.r * Math.sin(a);
		
		return pt
	}




function makeNewConnections(){

var con = svg.append('g').attr('class','newconnector').attr('transform','translate(60,60)')
.selectAll('path')
	.data(links).enter()
	.append('path')
	//.attr('d',function(d){getPathConnection(d.source,d.target)})
	.attr('d',function(d){return 'M0,0 L1,1'})
	.attr("stroke", "white")
	.attr("stroke-width", 1)
	.attr("fill", "white");
return con
}


function getPathConnection(idSource, idTarget, idItemCenter){
idItemCenter = typeof idItemCenter !== 'undefined' ? idItemCenter : false;


var ptA = {};
var ptB = {};


if(idItemCenter){
	
	if (idTarget == idItemCenter || idSource == idItemCenter){
	ptA.x = parseFloat(orbitCenter.x);
	ptA.y = parseFloat(orbitCenter.y);
	
	
	 ptB = getItemPosition(idTarget == idItemCenter ? idSource : idTarget);
	 
	}else{
		ptA.x = parseFloat(orbitCenter.x);
		ptA.y = parseFloat(orbitCenter.y);
		ptB.x = parseFloat(orbitCenter.x)+20;
		ptB.y = parseFloat(orbitCenter.y)+20;
		
	}
	
}else{
 ptB = getItemPosition(idTarget);
 ptA = getItemPosition(idSource);

}


ptA.peso = 1;
ptB.peso = 1;

var dis = pointDist(ptA,ptB);
var path;


if(dis == 0){
	ptB = {x: ptB.x+1, y: ptB.y+1}
	dis = pointDist(ptA,ptB);
}	

	var ptM = pointHalf(ptA,ptB);


	var fatorPesoA = dimpeso(ptA.peso);
	var fatorPesoB = dimpeso(ptB.peso);
	

	var angulo = getAngle(coefAngular(ptA,ptB));
	
	
	//se x destino < x origem
	if (ptA.x > ptB.x){
		angulo = angulo + 180;
	} else if(angulo == Infinity){
		if(ptA.y < ptB.y)
		angulo = 90+180;
	}
	
	var antiangulo = angulo  -180
	

	var ptAmed = getCirclePositionR({cx:ptA.x, cy:ptA.y, r:60*fatorPesoA},angulo);
	var ptAmin = getCirclePositionR({cx:ptA.x, cy:ptA.y, r:60*fatorPesoA},angulo+(larg/fatorPesoA));
	var ptAmax = getCirclePositionR({cx:ptA.x, cy:ptA.y, r:60*fatorPesoA},angulo-(larg/fatorPesoA));
	
	var ptBmed = getCirclePositionR({cx:ptB.x, cy:ptB.y, r:60*fatorPesoB},antiangulo);
	var ptBmin = getCirclePositionR({cx:ptB.x, cy:ptB.y, r:60*fatorPesoB},antiangulo-(larg/fatorPesoB));
	var ptBmax = getCirclePositionR({cx:ptB.x, cy:ptB.y, r:60*fatorPesoB},antiangulo+(larg/fatorPesoB));
	


	var ptM = pointHalf(ptAmed,ptBmed);
	
	var ida =[ptAmax,ptM,ptBmax]
	var volta = [ptBmin,ptM,ptAmin]
	
	 path = line(ida)+(line(volta).replace('M','L'))+'z'

return path
}


function	makeCentralCircle(){
var circleCenter = svg.append("circle")
	.attr('class','circlecenter')
	.attr({cx:center.x-300, cy: orbitRadius + margin.top, r: orbitRadius/2})
	.attr('opacity','1')
	.attr('transform', 'translate(60,60)');


var texto = svg.append("foreignObject")
.attr('x',getCirclePosition(circleCenter,10.5).x+60)
.attr('y',getCirclePosition(circleCenter,10.5).y+60)
	.attr({width: 210, height: 210})
	.style({background:"transparent"})
	.append("xhtml:body")
	.style({background:"transparent"})
	.append("xhtml:div")
	.style({width: 200 + 'px', 
        height: 200 + 'px'
    })
    .html("esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste esse é um texto longo de teste ")
.attr('class',"texto");
return texto;
}

function redivideHoras(feixeHoras){
divideHoras = d3.scale.linear().domain([0, 9]).range(feixeHoras);
moveDivide();
}

function refazPeso1(){
	dimpeso = d3.scale.linear().domain([1, 3]).range([peso1,1.5]);
	moveDivide();
}

svg.attr('visibility','hidden');




var linkElements =  makeNewConnections();
var texto = makeCentralCircle();
var nodeElements =  buildHome();
var labels = makeLabels();

redraw();

nodeElements.on('click',function(d){
	console.log(d.id);
	buildCenter(d.id);

	labels.style("opacity", 0);
})


svg.selectAll('.circlecenter').on('click',function(d){
unbuildCenter();
})

svg.selectAll('foreignObject').on('click',function(d){
unbuildCenter();
})

svg.transition().delay(1000).attr('visibility','visible').each('end',function(){moveDivide();
});



function makeSliders(){


d3.select('#sliderLarg').call(d3.slider().axis(true).value(8).min(2).max(15).step(1).on("slide", function(evt, value) {
      larg = value;
	d3.select('#text_sliderLarg').text(value)
	redivideHoras([horaInicio,horaFim]);
    }));

d3.select('#sliderHini').call(d3.slider().axis(true).value(horaInicio).min(0).max(12).step(0.5).on("slide", function(evt, value) {
	horaInicio = value;    
	d3.select('#text_sliderHini').text(horaInicio)
	redivideHoras([horaInicio,horaFim]);
    }));

d3.select('#sliderHfim').call(d3.slider().axis(true).value(horaFim).min(0).max(12).step(0.5).on("slide", function(evt, value) {
	horaFim = value;    
	d3.select('#text_sliderHfim').text(horaFim)
	redivideHoras([horaInicio,horaFim]);
    }));


d3.select('#sliderOrbit').call(d3.slider().axis(true).value(orbitRadius).min(100).max(500).step(25).on("slide", function(evt, value) {
	orbitRadius = value;    
	d3.select('#text_sliderOrbit').text(orbitRadius)
	orbit.attr('r',orbitRadius);
	redivideHoras([horaInicio,horaFim]);
    }));


d3.select('#sliderPeso').call(d3.slider().axis(true).value(1).min(0.2).max(2).step(0.2).on("slide", function(evt, value) {
      peso1 = value;
      refazPeso1();
	d3.select('#text_sliderPeso').text(value)
	redivideHoras([horaInicio,horaFim]);
    }));


d3.select('#button_tooglecenter').on('click',function(d){
	if (d3.select('#text_tooglecenter').text() == 'Oculta'){
		d3.select('#text_tooglecenter').text('Exibe')
	}else{
		d3.select('#text_tooglecenter').text('Oculta')
	}
	
	toogleCenter()
})



d3.select('#button_resetcenter').on('click',function(d){
	
	unbuildCenter(state.center);
})


d3.select('#button_tooglelogo').on('click',function(d){
	if (d3.select('#text_tooglelogo').text() == 'Logo'){
		d3.select('#text_tooglelogo').text('Mapa')
	}else{
		d3.select('#text_tooglelogo').text('Logo')
	}
	
	toogleMakeLogo();
})



}




function toogleCenter(){
	var toogle = +!+svg.select('.circlecenter').style('opacity');
	texto.style('opacity',toogle);
	svg.select('.circlecenter').transition().duration(1000).style('opacity',toogle);
	
}

function toogleMakeLogo(){
	state.logo = !state.logo;
	
	$('svg defs g > g:not(:first-child)')     .attr('opacity',+!state.logo);
	$('svg defs g > path:not(:first-child)')  .attr('opacity',+!state.logo);
	$('svg defs g > circle:not(:first-child)').attr('opacity',+!state.logo);

	labels.attr('fill-opacity',+!state.logo);
	toogleCenter();


}


makeSliders();
