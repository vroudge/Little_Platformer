function playerLibrary(param, box2dUtils, context) {
    
    var param = param;
    var box2dUtils = box2dUtils;
    var context = context;
    var x, y;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;

    this.updateCoords = function() {
        x = param.player.GetBody().GetPosition().x * param.scale;
        y = param.player.GetBody().GetPosition().y * param.scale;

        param.velocity = param.player.GetBody().GetLinearVelocity();

        box2dUtils.ray(param, context, x, y, Math.PI);
    }

    this.jump = function() {
        if (param.jumpContacts > 0) {
            // Appliquer une impulsion vers le haut
            param.player.GetBody().ApplyImpulse(
                    new b2Vec2(0, -25),                         // vecteur
                    param.player.GetBody().GetWorldCenter());    // point d'application de l'impulsion
        }

        if(param.playerJoint != null)
                box2dUtils.destroyJoint(param);
    }

    this.moveRight = function() {
        param.velocity.x = 140 / param.scale;
    }

    this.moveLeft = function() {
        param.velocity.x = -140 / param.scale;
    }

    this.settingsGrapple = function(direction) {
        if(direction === "up") {
            if(param.playerJoint && param.playerJoint.m_length > 1)  {
                param.playerJoint.m_length -= 0.1;
            }
        } else if(direction === "down") {
            if(param.playerJoint && param.playerJoint.m_length < 5)
                param.playerJoint.m_length += 0.1;
        }
    }
}