function enemyLibrary(param, box2dutils, context) {
    
    var param = param;
    var box2dutils = box2dutils;
    var context = context;
    var direction, enemyVelocity;
    var that = this;

    this.move = function() {
        if(param.enemies != 'undefined') {        
            for (var i = param.enemies.length - 1; i >= 0; i--) {
                enemyVelocity = param.enemies[i].GetBody().GetLinearVelocity();

                if(param.enemies[i].m_userData["direction"] === 'droite' && enemyVelocity.y <= 0) {
                    enemyVelocity.x = 50 / param.scale;
                } else if(param.enemies[i].m_userData["direction"] === 'gauche' && enemyVelocity.y <= 0) {
                    enemyVelocity.x = -50 / param.scale;
                }
            }
        }
    }

    this.spawn = function() {
        var enemy, random;

        random = Math.floor(Math.random() * 2);

        if(random === 0) {
            direction = 'droite';
        }
        else if(random === 1) {
            direction = 'gauche';
        }

        var enemyUserData = {
            "name": 'enemy',
            "direction": direction,
            "img": "slimeWalk1.png"
        };

        
        enemy = box2dutils.createBox(param.world, 300, 100, 10, 10, 0, false, enemyUserData); 
        enemy.GetBody().SetFixedRotation(true);
        param.enemies.push(enemy);
        param.gameObjects.push(enemy);
        param.objectDrawTab.push(enemy);

       /* setInterval(function() {
           that.spawn();
        }, 5000);*/

       /*setInterval(function() {
           var enemy = box2dutils.createBox(param.world, 300, 100, 10, 10, 0, false, enemyUserData); 
            enemy.GetBody().SetFixedRotation(true);
            param.enemies.push(enemy);
        }, 5000);*/
    }
}