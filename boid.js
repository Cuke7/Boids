// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

class Boid {
    constructor(index) {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));

        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 5;

        this.ref = createVector(1, 0);
        this.perceptionAngle = vue.angle;
        this.perceptionRadius = vue.vision;
        this.index = index;
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    steering(boids) {
        //drawArrow(this.position, this.velocity, "red");

        let align_steering = createVector();
        let separation_steering = createVector();
        let cohesion_steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);

            if (other != this && d < vue.vision) {
                let v1 = p5.Vector.sub(other.position, this.position);
                let angle = (this.velocity.angleBetween(v1) * 180) / PI;

                if (Math.abs(angle) < vue.angle / 2) {
                    //align
                    align_steering.add(other.velocity);

                    //separation
                    let diff = p5.Vector.sub(this.position, other.position);
                    diff.div(d * d);
                    separation_steering.add(diff);

                    //cohesion
                    cohesion_steering.add(other.position);

                    total++;
                }
            }
        }
        if (total > 0) {
            // align
            align_steering.div(total);
            align_steering.setMag(this.maxSpeed);
            align_steering.sub(this.velocity);
            align_steering.limit(this.maxForce);

            // separation
            separation_steering.div(total);
            separation_steering.setMag(this.maxSpeed);
            separation_steering.sub(this.velocity);
            separation_steering.limit(this.maxForce);

            //cohesion
            cohesion_steering.div(total);
            cohesion_steering.sub(this.position);
            cohesion_steering.setMag(this.maxSpeed);
            cohesion_steering.sub(this.velocity);
            cohesion_steering.limit(this.maxForce);
        }
        return [align_steering, separation_steering, cohesion_steering];
    }

    flock(boids) {
        this.acceleration = createVector();

        let steering_forces = this.steering(boids);
        let alignment = steering_forces[0];
        let separation = steering_forces[1];
        let cohesion = steering_forces[2];

        alignment.mult(vue.alignement);
        cohesion.mult(vue.cohesion);
        separation.mult(vue.separation);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
    }

    show() {
        //stroke(255);
        //point(this.position.x, this.position.y);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.ref.angleBetween(this.velocity));
        triangle(0, 5, 0, -5, 15, 0);
        //stroke(255);
        //noFill();
        //strokeWeight(1);
        if (this.index == 0) {
            fill("rgba(255,255,255, 0.25)");
            arc(0, 0, vue.vision * 2, vue.vision * 2, (-(vue.angle / 2) * PI) / 180, ((vue.angle / 2) * PI) / 180);
        }

        pop();
    }
}

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}
