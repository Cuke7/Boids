const flock = [];

// Init vue
let vue = new Vue({
    el: "#app",
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: "#000080",
                    secondary: "#d1b83d",
                    tertiary: "#c9720e",
                    grey: "#faf7f7",
                    accent: "#3557bd",
                },
                dark: {
                    primary: "#000080",
                    grey: "#292828",
                },
            },
        },
    }),
    data: () => ({
        alignement: 1.2,
        cohesion: 0.8,
        separation: 1.2,
        vision: 50,
    }),
    methods: {
        reset_forces() {
            this.alignement = 1.2;
            this.cohesion = 0.8;
            this.separation = 1.2;
            this.vision = 50;
        },
    },
});

//let alignSlider, cohesionSlider, separationSlider, radiusSlider;

function setup() {
    frameRate(60);
    stroke(255);
    cnv = createCanvas((windowWidth * 7) / 12, windowHeight * 0.8);

    cnv.parent("sketch-holder");

    for (let i = 0; i < 50; i++) {
        flock.push(new Boid(i));
    }
}

function draw() {
    background(0);
    for (let boid of flock) {
        boid.edges();
        boid.flock(flock);
    }

    for (const boid of flock) {
        boid.update();
        boid.show();
    }
}
