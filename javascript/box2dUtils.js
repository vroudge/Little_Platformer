(function() {
    
    // "Import" des classes box2dweb
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2AABB = Box2D.Collision.b2AABB;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2MassData = Box2D.Collision.Shapes.b2MassData;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;
    var b2RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef;
    var b2PrismaticJointDef =  Box2D.Dynamics.Joints.b2PrismaticJointDef;
    var b2RayCastInput = Box2D.Collision.b2RayCastInput;
    var b2RayCastOutput = Box2D.Collision.b2RayCastOutput;
    var b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
    var b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef;

    var bodies = [];
    var actors = [];
    
    //Constructeur
    Box2dUtils = function(scale) {
        this.scale = scale; // Définir l'échelle
    }
    
    //Classe Box2dUtils
    Box2dUtils.prototype = {
    
        // Création du monde box2d
        createWorld : function(context) {
             var world = new b2World(
                     new b2Vec2(0, 10), // gravité
                     true               // doSleep
            );

             //Définir la méthode d'affichage du débug
             var debugDraw = new b2DebugDraw();
             
             // Définir les propriétés d'affichage du débug
             debugDraw.SetSprite(context);      // contexte
             debugDraw.SetFillAlpha(0.5);       // transparence
             debugDraw.SetLineThickness(0.3);   // épaisseur du trait
             debugDraw.SetDrawScale(30.0);      // échelle
             
             //Affecter la méthode de d'affichage du débug au monde 2dbox
             debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
             world.SetDebugDraw(debugDraw);

             return world;
        },

         //Création d'un objet
        createBody : function(type, world, x, y, dimensions, angle, fixed, userData) {
            
            // Par défaut, l'objet est statique
            if (typeof(fixed) == 'undefined')
                fixed = true;

            // Créer l'élément Fixture
            var fixDef = new b2FixtureDef();
            fixDef.userData = userData;     // attribuer les propriétés spécifiques de l'objet
            
            // Dessiner l'objet en fonction de son type : sa forme et ses dimensions
            switch (type) {
                case 'box':
                    fixDef.shape = new b2PolygonShape();
                    if (angle == null) {
                        fixDef.shape.SetAsBox(dimensions.width / this.scale, dimensions.height / this.scale);
                    } 
                    else {
                        fixDef.shape.SetAsOrientedBox(dimensions.width / this.scale, dimensions.height / this.scale, 
                                new b2Vec2(0, 0),           // position par rapport au centre du body
                                angle * (Math.PI / 180));   // angle d'orientation (en radians)
                    }
                    break;
                case 'ball':
                    fixDef.shape = new b2CircleShape(dimensions.radius / this.scale);
                    break;
            }
            
            // Créer l'élément Body
            var bodyDef = new b2BodyDef();
            
            // Affecter la position à l'élément Body
            bodyDef.position.x = x / this.scale;
            bodyDef.position.y = y / this.scale;
            
            if (fixed) {
                // élément statique
                bodyDef.type = b2Body.b2_staticBody;
            } else {
                // élément dynamique
                bodyDef.type = b2Body.b2_dynamicBody;
                fixDef.density = 1.0;
                fixDef.restitution = 0.1;
                fixDef.friction =  1.0;
            }

            switch(userData.name) {
                case 'enemy':
                    fixDef.filter.categoryBits = CATEGORY_MONSTER;
                    fixDef.filter.maskBits = MASK_MONSTER;
                    break;
                case 'collectible':
                    fixDef.filter.categoryBits = CATEGORY_MONSTER;
                    fixDef.filter.maskBits = MASK_MONSTER;
                    break;
                case 'player':
                    fixDef.filter.categoryBits = CATEGORY_PLAYER; 
                    fixDef.filter.maskBits = MASK_PLAYER;
                    break;
                default:
                    fixDef.filter.categoryBits = CATEGORY_SCENERY;
                    fixDef.filter.maskBits = MASK_SCENERY;
                    break;
            }

            return world.CreateBody(bodyDef).CreateFixture(fixDef);
        },

        // Création d'un objet box
        createBox : function(world, x, y, width, height, angle, fixed, userData) {
            // Définir les dimensions de la box
            var dimensions = {
                    width: width,
                    height: height
            };
              
            if(typeof userData === 'object'){
                if(typeof userData.img === 'string') {
                    if(userData['img'] != undefined) {
                        var image = new Image();
                        image.src = "images/"+userData.img;
                        userData.img = image;
                    }
                }
            }
            // Appel de createBody()
            return this.createBody('box', world, x, y, dimensions, angle, fixed, userData);
        },

        // Création d'un objet ball
        createBall : function(world, x, y, radius, fixed, userData) {
            
            // Définir les dimensions de la ball
            var dimensions = {
                radius: radius  
            };
            // Appel de createBody()
            return this.createBody('ball', world, x, y, dimensions, null, fixed, userData);
        },
        
        //Création du player
        createPlayer : function(world, x, y, width, height, angle, fixed, userData) {
            // Créer le body player
            var playerObject = this.createBox(world, x, y, width, height, null, false, userData);
            playerObject.SetDensity(2);
            playerObject.SetRestitution(0.2);
            playerObject.SetFriction(0);
            playerObject.GetBody().SetSleepingAllowed(false);   // l'objet player n'est pas autorisé à passer au repos
            playerObject.GetBody().SetFixedRotation(true);      // empécher le player de "rouler"

            // Ajouter des "pieds"
            var footDef = new b2FixtureDef();
            footDef.friction = 2;
            footDef.userData = 'footPlayer';
            footDef.shape = new b2PolygonShape();
            footDef.shape.SetAsOrientedBox(10 / 30, 10 / 30, 
                    new b2Vec2(0, 25 / 1.8 / 30),   // position par rapport centre du body
                    0                                           // angle d'orientation
            );
            
            playerObject.GetBody().CreateFixture(footDef);

            return playerObject;
        },

        createObjects: function(nbObjects) {
            for (var i = nbObjects.length - 1; i >= 0; i--) {
                var object = nbObjects[i];      

                this.createBox(world, object.x, object.y, object.width, object.height, object != undefined ? object.angle: null, object.fixed, object.userData);
            }
        }, 

        //Destruction des objets
        destroyObject: function(world, destroys) {
            //Parcourt les objets dans le tableau 
            for (var i = destroys.length - 1; i >= 0; i--) {
                world.DestroyBody(destroys[i].GetBody());   //Supprime l'objet du monde
                destroys.splice(destroys.indexOf(destroys[i]), 1);  //Supprime l'objet du tableau
            }
        },

        ray: function(param, context, x, y, angle)  {
            var currentRayAngle = angle;
            var input = new b2RayCastInput();
            var output = new b2RayCastOutput();
            
            var b = new b2BodyDef();
            var f = new b2FixtureDef();
            
            var closestFraction = 1;
            
            var intersectionNormal = new b2Vec2(0,0);
            var intersectionPoint = new b2Vec2(0,0);
            
            var rayLength = 3; //long enough to hit the walls
            
            var p1 = new b2Vec2(x/30, y/30); //center of scene
            var p2 = new b2Vec2(0,0);
            
            var normalEnd = new b2Vec2(0,0);

            //calculate points of ray
            p2.x = p1.x + rayLength * Math.sin(currentRayAngle);
            p2.y = p1.y + rayLength * Math.cos(currentRayAngle);

            input.p1 = p1;
            input.p2 = p2;
            input.maxFraction = 1;
            closestFraction = 1;

            for(b = param.world.GetBodyList(); b; b = b.GetNext())    {           
                for(f = b.GetFixtureList(); f; f = f.GetNext()) {
                    if(!f.RayCast(output, input))
                        continue;
                    else if(output.fraction < closestFraction)  {
                        closestFraction = output.fraction;
                        intersectionNormal = output.normal;
                        if(f.m_userData.name === "littlePlatform" && param.keys[90] && param.useGrapple === true) {
                            this.createGrapple(param, f);
                        } // En utilisant le raycast

                        /*else if(f.m_userData.name === "littlePlatform") {
                            f.m_isSensor = true;
                            console.log('coucou')
                        }*/
                    }
                }
            }

            intersectionPoint.x = p1.x + closestFraction * (p2.x - p1.x);
            intersectionPoint.y = p1.y + closestFraction * (p2.y - p1.y);

            normalEnd.x = intersectionPoint.x + intersectionNormal.x;
            normalEnd.y = intersectionPoint.y + intersectionNormal.y;

            context.strokeStyle = "rgb(255, 255, 255)";

            context.beginPath(); // Start the path
            context.moveTo(p1.x*30,p1.y*30); // Set the path origin
            context.lineTo(intersectionPoint.x*30, intersectionPoint.y*30); // Set the path destination
            context.closePath(); // Close the path
            context.stroke();

            context.beginPath(); // Start the path
            context.moveTo(intersectionPoint.x*30, intersectionPoint.y*30); // Set the path origin
            context.lineTo(normalEnd.x*30, normalEnd.y*30); // Set the path destination
            context.closePath(); // Close the path
            context.stroke(); // Outline the path
        },

        createGrapple: function(param, platform) {
            var distance_joint = new b2DistanceJointDef();

            distance_joint.bodyA = param.player.GetBody();
            distance_joint.bodyB = platform.GetBody();

            //connect the centers - center in local coordinate - relative to body is 0,0
            distance_joint.localAnchorA = new b2Vec2(0, 0);
            distance_joint.localAnchorB = new b2Vec2(0, 0);
            
            //length of joint
            distance_joint.length = 3;
            distance_joint.collideConnected = true;
             
            //add the joint to the world
            param.playerJoint = param.world.CreateJoint(distance_joint);
            param.useGrapple = false;
        },

        destroyJoint: function(param) {
            param.world.DestroyJoint(param.playerJoint);
            param.useGrapple = true;
        },
    }
}());