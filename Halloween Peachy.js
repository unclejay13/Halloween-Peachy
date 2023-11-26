kaboom({
    global: true,
    fullscreen: true,
    scale: 1.5,
    debug: true,
    clearColor: [0.2,0.1,0.35,0.85]
})

const MOVE_SPEED = 150
const SLOW_SPEED = MOVE_SPEED/2
const JUMP_FORCE = 350
const BIG_JUMP_FORCE = 530
let CURRENT_SPEED = MOVE_SPEED
let CURRENT_JUMP_FORCE = JUMP_FORCE
let isJumping = true
let isSlow = true
const FALL_DEATH = 400
const FALL_PIPE = 500

loadRoot('https://i.imgur.com/')
loadSprite('peach','uBbAAhM.png')
loadSprite('bubble','NzxCCGS.png')
loadSprite('brick1','28IK0ey.png')
loadSprite('brick2','BMZk3c2.png')
loadSprite('brick3','8KaE4st.png')
loadSprite('brick4','R2Oamcn.png')
loadSprite('brick5','FwQw3wy.png')
loadSprite('surprise1','gNQqesI.png')
loadSprite('surprise2','QfgW6jD.png')
loadSprite('surprise3','7pKCRut.png')
loadSprite('unboxed1','wprFHub.png')
loadSprite('unboxed2','7UhBzJK.png')
loadSprite('unboxed3','Iq3a4r3.png')
loadSprite('web','bmCRVrq.png')
loadSprite('grave','8MoxGGg.png')
loadSprite('ghost','Q3noXJ5.png')
loadSprite('pumpkin','5OR6Atz.png')
loadSprite('poison','nNfFQLc.png')
loadSprite('eyeball','nxfpFnE.png')
loadSprite('pot','gJE3Bqm.png')
loadSprite('maple','vbYrAGj.png')
loadSprite('how_to_play','3khkHgC.png')
loadSprite('sand','xuvmvN5.png')

scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'uni'],'obj')


    const maps = [
        [      
        '       9          7                                                       ',
        '                     7                     7                              ',
        '                                         7                                ',
        '     7                                                                    ',
        '                                                                          ',
        '                                                                          ',
        '                                                7                         ',
        '                                                                          ',
        '  4                                                                       ',
        '                                                                          ',
        '4  4                       4  4            @                              ',
        '                                                                          ',
        'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh                      ',
        '                                                                          ',
        '                                                                          ',
        ],
        [      
        '                            7                    7                        ',
        '                  7                           7                       7   ',
        '   7                                              4                       ',
        '                                                                 @  5     ',
        '                                    +-+        $ --+  $                   ',
        '          $                                                   ----------  ',
        '                            4                                             ',
        '    5 5                                   7           4                   ',
        '                           1-+-                                           ',
        '-------------                                 -----------                 ',
        '                 5             ^   ^ 5 5                                  ',
        '                                                                          ',
        '               ---------------------------                                ',
        ],
        [
        'c          7                @       ====                           7     c',
        'c       7           7                                                    c',
        'c                       =======              =%*=%==      =%%==          c',
        'c               $                                                        c',
        'c                                 7                                      c',
        'c                                                                    $   c',
        'c              ==%%                        =====         $         4     c',
        'c       $                                                                c',
        'c                                                                 ====   c',
        'c      ==%=          //                //                 //             c',
        'c                  ////  4   ^        ////   ^  4  4     ////  7   ^   4 c',
        'c                //////             ///////             //////           c',
        'c========================================================================c',
        ],
        [
        '                          @                     ',
        '      $                                         ',
        '                        333333333        003    ',
        '                                                ',
        '      33                      $$                ',
        '       33003                                    ',
        '            $              33203       33       ',
        '                           3            33333   ',
        '    $         3    $    3333                    ',
        '          33333                                 ',
        '                                      3         ',
        '   333            33333      3333     3         ',
        ' 33333           3333          33333333         ',
        ]
    ] 

 

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('brick1'), solid(), scale(1.25)],
        'c': [sprite('brick2'), solid(), scale(1.25)],
        '/': [sprite('brick3'), solid(), scale(1.25)],
        '-': [sprite('brick4'), solid(), scale(1.25)],
        '3': [sprite('brick5'), solid(), scale(1.25)],
        '$': [sprite('bubble'), 'bubble', scale(0.75)],
        '%': [sprite('surprise1'), solid(), 'bubble-surprise1', scale(1.25)],
        '+': [sprite('surprise2'), solid(), 'bubble-surprise2', scale(1.25)],
        '0': [sprite('surprise3'), solid(), 'bubble-surprise3', scale(1.25)],
        '*': [sprite('surprise1'), solid(), 'poison-surprise1', scale(1.25)],
        '1': [sprite('surprise2'), solid(), 'poison-surprise2', scale(1.25)],
        '2': [sprite('surprise3'), solid(), 'poison-surprise3', scale(1.25)],
        '&': [sprite('unboxed1'), solid(), scale(1.25)],
        '!': [sprite('unboxed2'), solid(), scale(1.25)],
        '?': [sprite('unboxed3'), solid(), scale(1.25)],
        '@': [sprite('pot'), solid(), scale(2.12), 'pot'],
        '^': [sprite('ghost'), solid(), scale(1.2), 'dangerous'],
        '#': [sprite('poison'), solid(), 'poison',scale(0.77), body()],
        '4': [sprite('pumpkin'), scale(1.75)],
        '8': [sprite('maple'),solid(), scale(1.3)],
        '5': [sprite('eyeball'), solid(), scale(1.5)],
        '6': [sprite('grave'), scale(1.25)],
        '7': [sprite('web'), scale(1.25), 'web'],
        '9': [sprite('how_to_play'), scale(0.63)],
        'h': [sprite('sand'), solid(), scale(1.25)],
  
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    const scoreLabel = add([
        text(score),
        pos(30,6),
        layer('ui'),
        {
            value: score,
        }
    ])


    add([text('level'+ parseInt(level + 1)), pos(60,6)])
 

    function big() {
        let timer = 0 
        let isBig = false
        return {
            update() {
                if (isBig) {
                
                  timer -=dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            biggify() {
                this.scale = vec2(2)
                CURRENT_JUMP_FORCE = BIG_JUMP_FORCE   
                timer = time
                isBig = true
            },
            smallify() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = JUMP_FORCE
                timer = 0
                isBig = false
            },

        }
        
    }

    const player = add([
        sprite('peach'), solid(), pos(60,0),
        body(), origin('bot'), big(), 
    ])


    action('poison', (m) => {
        m.move(60, 0)
    })

    player.on("headbump", (obj) => {
        if (obj.is('bubble-surprise1')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('&', obj.gridPos.sub(0,0))
        }
        if (obj.is('poison-surprise1')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj) 
            gameLevel.spawn('&', obj.gridPos.sub(0,0))
        }
        if (obj.is('bubble-surprise2')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('!', obj.gridPos.sub(0,0))
        }
        if (obj.is('poison-surprise2')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj) 
            gameLevel.spawn('!', obj.gridPos.sub(0,0))
        }
        if (obj.is('bubble-surprise3')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('?', obj.gridPos.sub(0,0))
        }
        if (obj.is('poison-surprise3')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj) 
            gameLevel.spawn('?', obj.gridPos.sub(0,0))
        }
    })

    player.collides('poison', (m) => {
        player.biggify(4)
        destroy(m)
    })

    player.collides('bubble', (c) => {
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })

    const ENEMY_SPEED = 37
    
    action('dangerous', (d) => {
    d.move(-ENEMY_SPEED,0)
    })


    player.collides('dangerous', (d) => {
        if(isJumping) {
            destroy(d) 
        } else {
            go('lose', {score: scoreLabel.value})
        }
    })

    player.action(() => {
        camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', {score: scoreLabel.value})
        }
    })



    player.collides('pot', () => {
        keyPress('down', () => {
            player.smallify(4)
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        })
    })

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    player.action(() => {
        if(player.grounded()) {
            isJumping = false
        }
    })

      

    keyPress('up', () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })
})



scene('lose', ({score}) => {
    add([text(score,32), origin('center'), pos(width()/2, height()/2)])
}) 

start("game", {level: 0, score: 0})

addEventListener('keydown',({keyCode}) => {
    console.log(keyCode)
    switch (keyCode) {
        case 116:
        console.log('reload')
        location.reload(true)
        break
    }

})       



