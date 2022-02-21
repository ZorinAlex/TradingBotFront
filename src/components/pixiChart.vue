<template>
    <div class="chart"></div>
</template>

<script>
    import * as PIXI from 'pixi.js'
    import * as _ from 'lodash';
    export default {
        name: "pixiChart",
        data: ()=>({
            app: null,
            chartContainer: null,
            valuesLabelsContainer: null,
            timeLabelsContainer: null,
            lineGraphics: null,

            miniLineGraphics: null,
            miniLineChartContainer: null,
            miniLineChartPickerContainer: null,
            miniLinePickerGraphics: null,
            selectionEnabled: false,
            selectedTarget: null,
            leftSide: null,
            rightSide: null,
            leftSideBg: null,
            rightSideBg: null,

            leftPoint: null,
            rightPoint: null,

            horizontalLines: 5,
            topPadding: 50,
            bottomPadding: 40,
            miniLineChartHorizontalPadding: 10,
            chartHeight: 600,
            minChartHeight: 100,
            lineColor: 0xFFFFFF,
            points: [],
            currentPoints: []
        }),
        mounted() {
            //for devtools
            window.PIXI = PIXI;
            //
            this.app = new PIXI.Application({ antialias: true, transparent: false });
            this.$el.appendChild(this.app.view);
            this.app.renderer.view.style.display = "block";
            this.app.renderer.autoResize = true;
            this.app.renderer.resize(this.$el.offsetWidth, this.chartHeight);

            this.timeLabelsContainer = new PIXI.Container();
            this.app.stage.addChild(this.timeLabelsContainer);
            this.timeLabelsContainer.y = this.viewHeight() + this.topPadding;

            this.valuesLabelsContainer = new PIXI.Container();
            this.valuesLabelsContainer.y = this.topPadding;
            this.app.stage.addChild(this.valuesLabelsContainer);

            this.chartContainer = new PIXI.Container();
            this.app.stage.addChild(this.chartContainer);

            this.lineGraphics = new PIXI.Graphics();
            this.chartContainer.addChild(this.lineGraphics);
            this.linePointsGraphics = new PIXI.Graphics();
            this.chartContainer.addChild(this.linePointsGraphics);
            //miniChart
            this.miniLineChartContainer = new PIXI.Container();
            this.app.stage.addChild(this.miniLineChartContainer);
            this.miniLineChartContainer.x = this.miniLineChartHorizontalPadding;
            this.miniLineChartContainer.y = this.chartHeight - this.minChartHeight - this.topPadding;
            this.miniLineGraphics = new PIXI.Graphics();

            this.miniLineChartPickerContainer= new PIXI.Container();
            this.miniLineChartPickerContainer.y = this.chartHeight - this.minChartHeight - this.topPadding;
            this.app.stage.addChild(this.miniLineChartPickerContainer);
            this.miniLinePickerGraphics = new PIXI.Graphics();

            this.addTestData();
        },
        methods:{
            addTestData(){
                // _.forEach(_.range(0, 20), pointIndex =>{
                //     this.addPoint(pointIndex*50, Math.round(Math.random()*1000), 'red', 'circle');
                // })
                // let pointIndex = 1;
                // setInterval(()=>{
                //     this.addPoint(pointIndex*50, Math.round(Math.random()*1000), 'red', 'circle');
                //     pointIndex++;
                // }, 50)
                this.addPoint(0, 200, 'red', 'circle');
                this.addPoint(50, 100, 'red', 'circle');
                this.addPoint(100, 150, 'red', 'circle');
                this.addPoint(150, 150, 'red', 'circle');
                this.addPoint(200, 300, 'red', 'circle');
                this.addPoint(250, 400, 'red', 'circle');
                this.addPoint(300, 300, 'red', 'circle');
                this.addPoint(350, 120, 'red', 'circle');
                this.addPoint(400, 20, 'red', 'circle');
                this.addPoint(500, 150, 'red', 'circle');
                this.addPoint(600, 300, 'red', 'circle');
                this.addPoint(700, 320, 'red', 'circle');
                this.addPoint(800, 400, 'red', 'circle');
                this.addPoint(900, 400, 'red', 'circle');
                this.addPoint(1000, 350, 'red', 'circle');
            },
            redrawLineChart(){
                this.lineGraphics.clear();
                this.linePointsGraphics.clear();

                this.timeLabelsContainer.destroy({children: true});
                this.timeLabelsContainer = new PIXI.Container();
                this.app.stage.addChild(this.timeLabelsContainer);
                this.timeLabelsContainer.y = this.viewHeight() + this.topPadding;

                this.valuesLabelsContainer.destroy({children: true});
                this.valuesLabelsContainer = new PIXI.Container();
                this.valuesLabelsContainer.y = this.topPadding;

                this.app.stage.addChild(this.valuesLabelsContainer);

                this.drawLineChart();
                this.drawHorizontalAxes();
                this.addValueLabels();
                this.addTimeLabels();
            },
            clearContainers(){
                this.lineGraphics.clear();
                this.miniLineGraphics.clear();
                this.linePointsGraphics.clear();

                this.timeLabelsContainer.destroy({children: true});
                this.timeLabelsContainer = new PIXI.Container();
                this.app.stage.addChild(this.timeLabelsContainer);
                this.timeLabelsContainer.y = this.viewHeight() + this.topPadding;

                this.valuesLabelsContainer.destroy({children: true});
                this.valuesLabelsContainer = new PIXI.Container();
                this.valuesLabelsContainer.y = this.topPadding;

                this.app.stage.addChild(this.valuesLabelsContainer);
            },
            addPoint(x, y, color, shape){
                this.clearContainers();
                this.points.push({x,y,color,shape});
                this.drawMiniLineChart();
                if(this.points.length>= 10){
                    if(!this.selectionEnabled) this.addTimePickers();
                    this.selectionEnabled = true;
                    this.calcSelectedRegion();
                }else{
                    this.currentPoints.push({x,y,color,shape});
                }
                this.drawLineChart();
                this.drawHorizontalAxes();
                this.addValueLabels();
                this.addTimeLabels();
            },
            drawLineChart(){
                this.lineGraphics.lineStyle(2, this.lineColor, 1);
                const {Ymin, Ymax} = this.minMaxYDataCurrent();
                const {Xmin, Xmax} = this.minMaxXDataCurrent();
                const Yfactor = this.viewHeight()/(Ymax - Ymin);
                const fullWidth = this.app.renderer.width/this.app.renderer.resolution;
                const Xfactor = fullWidth/(Xmax - Xmin);
                if(this.selectionEnabled) this.lineGraphics.moveTo(this.leftPoint.x*Xfactor,this.leftPoint.y*Yfactor);
                _.forEach(this.currentPoints, (point, index)=>{
                    const x_coord = (point.x - Xmin)*Xfactor;
                    const y_coord = this.viewHeight() + this.topPadding -point.y*Yfactor;
                    if(index === 0 && !this.selectionEnabled){
                        this.lineGraphics.moveTo(x_coord,y_coord);
                    }else{
                        this.lineGraphics.lineTo(x_coord,y_coord);
                    }
                    this.drawPoint(x_coord, y_coord, point.color, point.shape)
                });
                if(this.selectionEnabled) this.lineGraphics.moveTo(this.rightPoint.x*Xfactor,this.rightPoint.y*Yfactor);
            },
            drawPoint(x, y, color, shape){
                this.linePointsGraphics.lineStyle(0);
                this.linePointsGraphics.beginFill(0xFF0000, 1);
                switch (shape) {
                    case 'circle':
                        this.linePointsGraphics.drawCircle(x, y, 3);
                        break;
                    case 'rectangle':
                        this.linePointsGraphics.drawRect(x, y, 3, 3);
                        break;
                    case 'star':
                        this.linePointsGraphics.drawStar(x, y, 5, 3);
                        break;
                }
                this.linePointsGraphics.endFill();
            },
            drawMiniLineChart(){
                this.miniLineGraphics.lineStyle(1, this.lineColor, 1);
                const {Ymin, Ymax} = this.minMaxYData();
                const {Xmin, Xmax} = this.minMaxXData();
                const Yfactor = this.minChartHeight/(Ymax - Ymin);
                const fullWidth = this.app.renderer.width/this.app.renderer.resolution-this.miniLineChartHorizontalPadding*2;
                const Xfactor = fullWidth/(Xmax - Xmin);
                _.forEach(this.points, (point, index)=>{
                    const x_coord = point.x*Xfactor;
                    const y_coord = this.minChartHeight + this.topPadding -point.y*Yfactor;
                    if(index === 0) {
                        this.miniLineGraphics.moveTo(x_coord,y_coord)
                    }else{
                        this.miniLineGraphics.lineTo(x_coord,y_coord);
                    }
                });
                this.miniLineChartContainer.addChild(this.miniLineGraphics)
            },
            drawHorizontalAxes(){
                const fullWidth = this.app.renderer.width/this.app.renderer.resolution;
                const horizontalLineStep = this.viewHeight()/this.horizontalLines;
                this.lineGraphics.lineStyle(1, this.lineColor, 0.2);
                _.forEach(_.range(0, this.horizontalLines+1), line =>{
                    this.lineGraphics.moveTo(0,this.viewHeight() -  horizontalLineStep * line + this.topPadding);
                    this.lineGraphics.lineTo(fullWidth,this.viewHeight() - horizontalLineStep * line+ this.topPadding);
                })
            },
            addValueLabels(){
                const horizontalLineStep = this.viewHeight()/this.horizontalLines;
                const LabelStyle = new PIXI.TextStyle({
                    fontFamily: "Roboto",
                    fontSize: 13,
                    fill: ['#ffffff']
                });
                const {Ymin, Ymax} = this.minMaxYDataCurrent();
                const labelValueStep = (Ymax - Ymin)/this.horizontalLines;
                _.forEach(_.range(0, this.horizontalLines+1), line =>{
                    const y_coord = this.viewHeight() - horizontalLineStep * line;
                    const label = new PIXI.Text((Math.round(Ymax-labelValueStep*line)).toString(), LabelStyle);
                    label.x = 2;
                    label.y = this.viewHeight() -y_coord-20;
                    this.valuesLabelsContainer.addChild(label);
                })
            },
            addTimeLabels(){
                const {Xmin, Xmax} = this.minMaxXDataCurrent();
                const fullWidth = this.app.renderer.width/this.app.renderer.resolution;
                const Xfactor = fullWidth/(Xmax - Xmin);

                const LabelStyle = new PIXI.TextStyle({
                    fontFamily: "Roboto",
                    fontSize: 13,
                    align: 'left',
                    fill: ['#ffffff']
                });
                _.forEach(this.currentPoints, point =>{
                    const label = new PIXI.Text((point.x).toString(), LabelStyle);
                    label.x = (point.x - Xmin)*Xfactor+5;
                    label.y = 5;
                    label.anchor.set(1, 1);
                    label.rotation = -Math.PI /2;
                    this.timeLabelsContainer.addChild(label);
                })
            },
            addTimePickers(){
                this.miniLinePickerGraphics.beginFill(0xDE3249);
                this.miniLinePickerGraphics.drawRect(0, 0, 10, this.minChartHeight);
                this.miniLinePickerGraphics.endFill();
                let texture = this.app.renderer.generateTexture(this.miniLinePickerGraphics);
                let leftSide = new PIXI.Sprite(texture);
                // leftSide.anchor.set(0.5,0.5);
                let rightSide = new PIXI.Sprite(texture);
                // rightSide.anchor.set(0,0);
                leftSide.x = 0;
                leftSide.y = this.minChartHeight/2;
                leftSide.name = 'left';

                rightSide.x = this.app.renderer.width/this.app.renderer.resolution - 10;
                rightSide.y = this.minChartHeight/2;
                rightSide.name = 'right';

                leftSide.interactive = true;
                leftSide.buttonMode = true;
                leftSide.on('pointerdown', this.onDragStart);
                leftSide.on('pointerup', this.onDragEnd);
                leftSide.on('pointerupoutside', this.onDragEnd);

                rightSide.interactive = true;
                rightSide.buttonMode = true;
                rightSide.on('pointerdown', this.onDragStart);
                rightSide.on('pointerup', this.onDragEnd);
                rightSide.on('pointerupoutside', this.onDragEnd);

                this.leftSide = leftSide;
                this.rightSide = rightSide;

                this.miniLineChartPickerContainer.addChild(leftSide);
                this.miniLineChartPickerContainer.addChild(rightSide);

                this.miniLinePickerGraphics.clear();
                this.miniLinePickerGraphics.beginFill(0x000000);
                this.miniLinePickerGraphics.drawRect(0, 0, 10, this.minChartHeight);
                this.miniLinePickerGraphics.endFill();
                texture = this.app.renderer.generateTexture(this.miniLinePickerGraphics);

                let leftSideBg = new PIXI.Sprite(texture);
                let rightSideBg = new PIXI.Sprite(texture);
                leftSideBg.y = this.minChartHeight/2;
                rightSideBg.y = this.minChartHeight/2;
                leftSideBg.anchor.set(0, 0);
                rightSideBg.anchor.set(0, 0);
                leftSideBg.alpha = 0.6;
                rightSideBg.alpha = 0.6;
                leftSideBg.width = this.leftSide.position.x;
                rightSideBg.position.x = rightSide.position.x + 10;
                rightSideBg.width = this.app.renderer.width/this.app.renderer.resolution - rightSideBg.position.x;
                this.leftSideBg = leftSideBg;
                this.rightSideBg = rightSideBg;
                this.miniLineChartPickerContainer.addChild(leftSideBg);
                this.miniLineChartPickerContainer.addChild(rightSideBg);
            },
            onDragStart(e) {
                e.target.alpha = 0.5;
                this.selectedTarget = e.target;
                this.app.stage.interactive = true;
                this.app.stage.on('pointermove', this.onDragMove);
            },
            onDragEnd() {
                this.selectedTarget.alpha = 1;
                this.app.stage.interactive = false;
                this.redrawLineChart();
            },
            onDragMove(e) {
                let x_coord = e.data.global.x;
                if(this.selectedTarget.name === 'left'){
                    if(x_coord < 0){
                        x_coord = 0
                    }else if(x_coord > this.rightSide.position.x-10){
                        x_coord = this.rightSide.position.x-10
                    }
                    this.leftSideBg.width = x_coord;
                }else{
                    if(x_coord < this.leftSide.position.x+10){
                        x_coord = this.leftSide.position.x + 10
                    }else if(x_coord > this.app.renderer.width/this.app.renderer.resolution - 10){
                        x_coord = this.app.renderer.width/this.app.renderer.resolution - 10
                    }
                    this.rightSideBg.position.x = x_coord + 10;
                    this.rightSideBg.width = this.app.renderer.width/this.app.renderer.resolution - x_coord;
                }
                this.selectedTarget.position.x = x_coord;
                this.calcSelectedRegion()
            },
            calcSelectedRegion(){
                const {Xmin, Xmax} = this.minMaxXData();
                const fullWidth = this.app.renderer.width/this.app.renderer.resolution - 2*this.miniLineChartHorizontalPadding;
                const Xfactor = fullWidth/(Xmax - Xmin);
                const leftX = this.leftSide.position.x + 10;
                const rightX = this.rightSide.position.x;
                const leftIndex = _.findIndex(this.points, point =>{
                    return point.x*Xfactor + this.miniLineChartHorizontalPadding>=leftX
                });
                const rightIndex  = _.findIndex(this.points, point =>{
                    return point.x*Xfactor  + this.miniLineChartHorizontalPadding>=rightX
                });

                let leftY;
                if(leftIndex === 0){
                    leftY = this.points[0].y
                }else{
                    const lambda = ((leftX - this.miniLineChartHorizontalPadding)/Xfactor - this.points[leftIndex - 1].x)/(this.points[leftIndex].x - (leftX-this.miniLineChartHorizontalPadding)/Xfactor);
                    leftY = Math.round((this.points[leftIndex - 1].y + lambda*this.points[leftIndex].y)/(1+lambda));
                }

                let rightY;
                if(rightIndex === this.points.length - 1){
                    rightY = this.points[this.points.length -1].y
                }else{
                    const lambda = ((rightX - this.miniLineChartHorizontalPadding)/Xfactor - this.points[rightIndex - 1].x)/(this.points[rightIndex].x - (rightX-this.miniLineChartHorizontalPadding)/Xfactor);
                    rightY = Math.round((this.points[rightIndex - 1].y + lambda*this.points[rightIndex].y)/(1+lambda));
                }
                this.currentPoints = this.points.slice(leftIndex, rightIndex);
                this.leftPoint = {x: leftX, y: leftY};
                this.rightPoint = {x: rightX, y: rightY};
            },
            viewHeight(){
                return this.chartHeight - this.topPadding - this.bottomPadding - this.minChartHeight;
            },
            minMaxYData(){
                const Ymin = _.minBy(this.points, point=> point.y).y;
                const Ymax = _.maxBy(this.points, point=> point.y).y;
                return {Ymin, Ymax}
            },
            minMaxXData(){
                const Xmin = _.minBy(this.points, point=> point.x).x;
                const Xmax = _.maxBy(this.points, point=> point.x).x;
                return {Xmin, Xmax}
            },
            minMaxYDataCurrent(){
                const Ymin = _.minBy(this.currentPoints, point=> point.y).y;
                const Ymax = _.maxBy(this.currentPoints, point=> point.y).y;
                return {Ymin, Ymax}
            },
            minMaxXDataCurrent(){
                const Xmin = _.minBy(this.currentPoints, point=> point.x).x;
                const Xmax = _.maxBy(this.currentPoints, point=> point.x).x;
                return {Xmin, Xmax}
            }
        },
    }
</script>

<style scoped>

</style>
