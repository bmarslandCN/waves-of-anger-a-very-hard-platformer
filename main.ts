namespace SpriteKind {
    export const TileIcon = SpriteKind.create()
    export const CustomMouse = SpriteKind.create()
    export const Tile = SpriteKind.create()
    export const Bar = SpriteKind.create()
    export const SpecialTileIcon = SpriteKind.create()
    export const CustomCamera = SpriteKind.create()
    export const Button = SpriteKind.create()
    export const SettingsFunction = SpriteKind.create()
    export const Warning = SpriteKind.create()
    export const Misc = SpriteKind.create()
    export const Menu = SpriteKind.create()
    export const ScreenFX = SpriteKind.create()
    export const Starwalker = SpriteKind.create()
    export const Controller = SpriteKind.create()
    export const Spike = SpriteKind.create()
    export const Checkpoint = SpriteKind.create()
    export const Goal = SpriteKind.create()
    export const ClearedCheckpoint = SpriteKind.create()
    export const ToggleButton = SpriteKind.create()
    export const Bug = SpriteKind.create()
    export const Ben = SpriteKind.create()
}
sprites.onDestroyed(SpriteKind.Menu, function (sprite) {
    sprites.setDataBoolean(Mouse, "Selectingdifficulty", false)
    if (GameLoaded == 0 && EditorLoaded == 0) {
        LoadTitleScreen()
    }
})
function CloseTilemapEditor () {
    DitherTransition()
    timer.after(700, function () {
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        sprites.destroyAllSpritesOfKind(SpriteKind.TileIcon)
        sprites.destroyAllSpritesOfKind(SpriteKind.Tile)
        sprites.destroyAllSpritesOfKind(SpriteKind.Bar)
        sprites.destroyAllSpritesOfKind(SpriteKind.SpecialTileIcon)
        sprites.destroyAllSpritesOfKind(SpriteKind.Button)
        sprites.destroyAllSpritesOfKind(SpriteKind.Warning)
        sprites.destroyAllSpritesOfKind(SpriteKind.Misc)
        sprites.destroyAllSpritesOfKind(SpriteKind.Menu)
        sprites.destroyAllSpritesOfKind(SpriteKind.Controller)
        LoadTitleScreen()
    })
}
sprites.onDestroyed(SpriteKind.Button, function (sprite) {
    if (sprite.image.equals(assets.image`HelpIcon`)) {
        HelpButton = sprites.create(assets.image`HelpIcon`, SpriteKind.Button)
    }
})
sprites.onCreated(SpriteKind.Tile, function (sprite) {
    sprite.z = -2
    if (sprite.overlapsWith(IncrediblePolo)) {
        sprites.destroy(sprite)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Checkpoint, function (sprite, otherSprite) {
    for (let value of sprites.allOfKind(SpriteKind.Checkpoint)) {
        if (IncrediblePolo.overlapsWith(value)) {
            value.setKind(SpriteKind.ClearedCheckpoint)
            animation.runImageAnimation(
            value,
            assets.animation`FlagTransition`,
            100,
            false
            )
            music.play(music.createSoundEffect(WaveShape.Sine, 1316, 1599, 255, 0, 1000, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            SpawnLocation = value.tilemapLocation()
        } else {
            value.setKind(SpriteKind.Checkpoint)
            value.setImage(assets.image`CheckpointTile`)
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`EndTip`, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`transparency16`)
    for (let value of tiles.getTilesByType(assets.tile`EndMiddle`)) {
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of tiles.getTilesByType(assets.tile`EndBase`)) {
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of sprites.allOfKind(SpriteKind.Goal)) {
        animation.runImageAnimation(
        value,
        assets.animation`GateFlip`,
        100,
        false
        )
    }
    timer.after(1500, function () {
        DitherTransition()
        timer.after(750, function () {
            sprite.setPosition(0, 0)
            sprites.destroy(sprite)
            LoadTitleScreen()
            LogPoints()
        })
    })
})
function TestLevel () {
    EditorLoaded = 2
    sprites.destroyAllSpritesOfKind(SpriteKind.TileIcon)
    sprites.destroyAllSpritesOfKind(SpriteKind.SpecialTileIcon)
    sprites.destroyAllSpritesOfKind(SpriteKind.Bar)
    sprites.destroyAllSpritesOfKind(SpriteKind.Controller)
}
sprites.onCreated(SpriteKind.TileIcon, function (sprite) {
    sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
})
sprites.onCreated(SpriteKind.CustomMouse, function (sprite) {
    sprite.z = 3
    sprite.setStayInScreen(true)
    sprite.setFlag(SpriteFlag.Invisible, true)
})
sprites.onCreated(SpriteKind.CustomCamera, function (sprite) {
    scene.cameraFollowSprite(sprite)
    sprite.z = 2
    sprite.setFlag(SpriteFlag.Invisible, true)
})
sprites.onOverlap(SpriteKind.Tile, SpriteKind.Tile, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    if (sprite.image.equals(assets.image`EmptyIcon`)) {
        sprites.destroy(otherSprite)
    }
})
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Warning)
    if (GameLoaded == 1) {
        sprites.setDataBoolean(ClockDisplay, "RunClock", true)
    }
})
function Die () {
    controller.moveSprite(IncrediblePolo, 0, 0)
    sprites.setDataBoolean(IncrediblePolo, "Dead", true)
    IncrediblePolo.setVelocity(0, 0)
    IncrediblePolo.ay = 0
    SoundFX("Die")
    DitherTransition()
    timer.after(750, function () {
        tiles.placeOnTile(IncrediblePolo, SpawnLocation)
        controller.moveSprite(IncrediblePolo, 70, 0)
        sprites.setDataBoolean(IncrediblePolo, "Dead", false)
        sprites.changeDataNumberBy(DeathDisplay, "Deaths", 1)
        DeathDisplay.setText(convertToText(sprites.readDataNumber(DeathDisplay, "Deaths")))
        sprites.setDataNumber(DeathDisplay, "DeathLength", convertToText(sprites.readDataNumber(DeathDisplay, "Deaths")).length)
        IncrediblePolo.ay = 500
    })
}
function SoundFX (ID: string) {
    if (ID == "Transition") {
        music.play(music.createSoundEffect(WaveShape.Sine, 2425, 0, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        timer.after(550, function () {
            music.play(music.createSoundEffect(WaveShape.Sine, 1, 2067, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        })
    }
    if (ID == "Die") {
        music.play(music.createSoundEffect(
        WaveShape.Noise,
        randint(2000, 3500),
        1,
        255,
        0,
        500,
        SoundExpressionEffect.Vibrato,
        InterpolationCurve.Logarithmic
        ), music.PlaybackMode.InBackground)
    }
}
function LoadTitleScreen () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Button)
    sprites.destroyAllSpritesOfKind(SpriteKind.Spike)
    sprites.destroyAllSpritesOfKind(SpriteKind.Checkpoint)
    sprites.destroyAllSpritesOfKind(SpriteKind.ClearedCheckpoint)
    sprites.destroyAllSpritesOfKind(SpriteKind.Goal)
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    EditorLoaded = 0
    GameLoaded = 0
    sprites.setDataNumber(Camera, "BackgroundMovement", 0)
    Camera.setPosition(0, 0)
    scene.cameraFollowSprite(Camera)
    tiles.setCurrentTilemap(tilemap`TitleScreen`)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`Background`)
    Camera.setPosition(0, 0)
    Title = sprites.create(assets.image`Title`, SpriteKind.Misc)
    PlayButton = sprites.create(assets.image`PlayIcon`, SpriteKind.Button)
    PlayButton.setPosition(16, 67)
    TilemapButton = sprites.create(assets.image`LevelEditorIcon`, SpriteKind.Button)
    TilemapButton.setPosition(21, 103)
    CodesButton = sprites.create(assets.image`CodesButton`, SpriteKind.Button)
    CodesButton.setPosition(142, 32)
}
function LoadLevel (_: number) {
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Bar)
    sprites.destroyAllSpritesOfKind(SpriteKind.Text)
    sprites.destroy(Title)
    EditorLoaded = 0
    GameLoaded = 1
    if (_ == 1) {
        tiles.setCurrentTilemap(tilemap`EasyDifficulty`)
    }
    if (_ == 2) {
        tiles.setCurrentTilemap(tilemap`MediumDifficulty`)
    }
    if (_ == 3) {
        tiles.setCurrentTilemap(tilemap`HardDifficulty`)
    }
    if (_ == 4) {
        tiles.setCurrentTilemap(tilemap`InsaneDifficulty`)
    }
    IncrediblePolo = sprites.create(assets.image`IncrediblePoloRight`, SpriteKind.Player)
    SpawnLocation = tiles.getTileLocation(1, 13)
    scene.cameraFollowSprite(IncrediblePolo)
    sprites.setDataNumber(Mouse, "LevelDifficulty", _)
    for (let value of tiles.getTilesByType(assets.tile`SandFloor`)) {
        tiles.setWallAt(value, true)
    }
    for (let value of tiles.getTilesByType(assets.tile`SandFiller`)) {
        tiles.setWallAt(value, true)
    }
    for (let value of tiles.getTilesByType(assets.tile`SpikeFloor`)) {
        SpikeTile = sprites.create(assets.image`FloorSpikeIcon`, SpriteKind.Spike)
        tiles.placeOnTile(SpikeTile, value)
    }
    for (let value of tiles.getTilesByType(assets.tile`SpikeCieling`)) {
        SpikeTile = sprites.create(assets.image`CielingSpikeIcon`, SpriteKind.Spike)
        tiles.placeOnTile(SpikeTile, value)
    }
    for (let value of tiles.getTilesByType(assets.tile`SpikeMiniRight`)) {
        SpikeTile = sprites.create(assets.image`MiniRightSpikeIcon`, SpriteKind.Spike)
        tiles.placeOnTile(SpikeTile, value)
    }
    for (let value of tiles.getTilesByType(assets.tile`SpikeMiniLeft`)) {
        SpikeTile = sprites.create(assets.image`MiniSpikeLeftIcon`, SpriteKind.Spike)
        tiles.placeOnTile(SpikeTile, value)
    }
    for (let value of tiles.getTilesByType(assets.tile`CheckpointOff`)) {
        CheckpointTile = sprites.create(assets.image`CheckpointIconCheck`, SpriteKind.Checkpoint)
        tiles.placeOnTile(CheckpointTile, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
    }
    for (let value of tiles.getTilesByType(assets.tile`EndMiddle`)) {
        GoalTile = sprites.create(assets.image`Gate`, SpriteKind.Goal)
        tiles.placeOnTile(GoalTile, value)
        GoalTile.y += -7
    }
    tiles.placeOnTile(IncrediblePolo, SpawnLocation)
    sprites.destroyAllSpritesOfKind(SpriteKind.Button)
    sprites.destroyAllSpritesOfKind(SpriteKind.Menu)
    ExitButton = sprites.create(assets.image`QuitButton`, SpriteKind.Button)
    ClockBar = sprites.create(assets.image`TimeSpentMeter`, SpriteKind.Bar)
    ClockDisplay = textsprite.create("0", 0, 15)
    sprites.setDataBoolean(ClockDisplay, "RunClock", false)
    sprites.setDataNumber(ClockDisplay, "ClockLength", 1)
    sprites.setDataNumber(ClockDisplay, "Time", 0)
    DeathBar = sprites.create(assets.image`DeathsMeter`, SpriteKind.Bar)
    DeathDisplay = textsprite.create("0", 0, 15)
    sprites.setDataNumber(DeathDisplay, "Deaths", 0)
    sprites.setDataNumber(DeathDisplay, "DeathLength", 1)
}
sprites.onOverlap(SpriteKind.CustomMouse, SpriteKind.SpecialTileIcon, function (sprite, otherSprite) {
    if (browserEvents.MouseLeft.isPressed()) {
        sprites.setDataNumber(Selector, "OffsetX", otherSprite.x - scene.cameraProperty(CameraProperty.X) + 80)
        sprites.setDataNumber(Selector, "OffsetY", otherSprite.y - scene.cameraProperty(CameraProperty.Y) - 50)
    }
})
sprites.onCreated(SpriteKind.Text, function (sprite) {
    sprite.setFlag(SpriteFlag.Ghost, true)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (GameLoaded == 1) {
        IncrediblePolo.setImage(assets.image`IncrediblePoloLeft`)
    }
})
sprites.onCreated(SpriteKind.Bar, function (sprite) {
    sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
})
function LogPoints () {
    if (sprites.readDataNumber(Mouse, "LevelDifficulty") == 1) {
        sprites.setDataBoolean(Mouse, "EasyComplete", true)
    } else if (sprites.readDataNumber(Mouse, "LevelDifficulty") == 2) {
        sprites.setDataBoolean(Mouse, "MediumComplete", true)
    } else if (sprites.readDataNumber(Mouse, "LevelDifficulty") == 3) {
        sprites.setDataBoolean(Mouse, "HardComplete", true)
    } else if (sprites.readDataNumber(Mouse, "LevelDifficulty") == 4) {
        sprites.setDataBoolean(Mouse, "InsaneComplete", true)
    }
    if (sprites.readDataBoolean(Mouse, "EasyComplete") == true && (sprites.readDataBoolean(Mouse, "MediumComplete") == true && (sprites.readDataBoolean(Mouse, "HardComplete") == true && sprites.readDataBoolean(Mouse, "InsaneComplete") == false))) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Button)
        BenCoverUp = sprites.create(img`
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            `, SpriteKind.ScreenFX)
        BenYesNoHoahHoahHoahUegh = sprites.create(assets.image`TalkingBenPreAnimation`, SpriteKind.Ben)
        BenYesNoHoahHoahHoahUegh.z = 1000
        music.play(music.createSong(assets.song`TalkingBenSpeech0`), music.PlaybackMode.InBackground)
        animation.runImageAnimation(
        BenYesNoHoahHoahHoahUegh,
        assets.animation`TalkingBenCall`,
        2000,
        false
        )
        BenYesNoHoahHoahHoahUegh.setPosition(49, 8)
        timer.after(19000, function () {
            BenYesNoHoahHoahHoahUegh.setImage(assets.image`TalkingBenPayment`)
            BenYesNoHoahHoahHoahUegh.setPosition(79, 55)
            pause(10000)
            game.setGameOverMessage(true, "Take the money I stole -Ben")
            game.gameOver(true)
        })
    }
    if (sprites.readDataBoolean(Mouse, "EasyComplete") == true && (sprites.readDataBoolean(Mouse, "MediumComplete") == true && (sprites.readDataBoolean(Mouse, "HardComplete") == true && sprites.readDataBoolean(Mouse, "InsaneComplete") == true))) {
        CheckOutMyPerfectForm = sprites.create(assets.image`ThePerfectSprite`, SpriteKind.Bug)
        music.setVolume(78)
        music.play(music.createSong(assets.song`IntroLoop`), music.PlaybackMode.LoopingInBackground)
        timer.after(5000, function () {
            game.setGameOverMessage(true, "You are perfect...")
            game.gameOver(true)
        })
    }
}
function AskDiffuculty () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Button)
    DifficultySelectMenu = sprites.create(assets.image`DifficultySelectMenu`, SpriteKind.Menu)
    DifficultySelectMenu.setFlag(SpriteFlag.Invisible, false)
    DifficultySelectMenu.z = 0
    EasyButton = sprites.create(assets.image`EasyButton`, SpriteKind.Button)
    EasyButton.setPosition(56, 40)
    MediumButton = sprites.create(assets.image`MediumButton`, SpriteKind.Button)
    MediumButton.setPosition(63, 55)
    HardButton = sprites.create(assets.image`HardButton`, SpriteKind.Button)
    HardButton.setPosition(56, 70)
    InsaneButton = sprites.create(assets.image`InsaneButton`, SpriteKind.Button)
    InsaneButton.setPosition(62, 85)
    sprites.setDataBoolean(Mouse, "Selectingdifficulty", true)
    if (sprites.readDataBoolean(Mouse, "EasyComplete") == true) {
        EasyButton.setImage(assets.image`EasyComplete`)
    }
    if (sprites.readDataBoolean(Mouse, "MediumComplete") == true) {
        MediumButton.setImage(assets.image`MediumComplete`)
    }
    if (sprites.readDataBoolean(Mouse, "HardComplete") == true) {
        HardButton.setImage(assets.image`HardComplete`)
    }
    if (sprites.readDataBoolean(Mouse, "InsaneComplete") == true) {
        InsaneButton.setImage(assets.image`InsaneComplete`)
    }
}
function DitherTransition () {
    SoundFX("Transition")
    Transition = sprites.create(assets.image`DitherTransitionFinal`, SpriteKind.ScreenFX)
    Transition.z = 100
    Transition.lifespan = 1500
    animation.runImageAnimation(
    Transition,
    assets.animation`DitherTransition`,
    50,
    false
    )
}
sprites.onCreated(SpriteKind.Menu, function (sprite) {
    sprite.z = 3
    sprite.setFlag(SpriteFlag.Invisible, true)
})
sprites.onCreated(SpriteKind.Button, function (sprite) {
    sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (GameLoaded == 1) {
        IncrediblePolo.setImage(assets.image`IncrediblePoloRight`)
    }
})
function EnterCode (Answer: string) {
    if (Answer == "EasyDone1") {
        sprites.setDataBoolean(Mouse, "EasyComplete", true)
    }
    if (Answer == "MediumDone2") {
        sprites.setDataBoolean(Mouse, "MediumComplete", true)
    }
    if (Answer == "HardDone3") {
        sprites.setDataBoolean(Mouse, "HardComplete", true)
    }
    if (Answer == "InsaneDone4") {
        sprites.setDataBoolean(Mouse, "InsaneComplete", true)
    }
    if (Answer == "StarWalker") {
        ThisPerfectFormMakesMeMad = sprites.create(assets.image`I am the         family friendly        Starwalker`, SpriteKind.Starwalker)
        ThisPerfectFormMakesMeMad.setPosition(81, 103)
    }
    if (Answer == "PerfectPrize") {
        CheckOutMyPerfectForm = sprites.create(assets.image`ThePerfectSprite`, SpriteKind.Bug)
        music.setVolume(78)
        music.play(music.createSong(assets.song`IntroLoop`), music.PlaybackMode.LoopingInBackground)
        timer.after(5000, function () {
            game.setGameOverMessage(true, "You are perfect...")
            game.gameOver(true)
        })
    }
    if (Answer == "GreatfulBen") {
        sprites.destroyAllSpritesOfKind(SpriteKind.Button)
        BenCoverUp = sprites.create(img`
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            `, SpriteKind.ScreenFX)
        BenYesNoHoahHoahHoahUegh = sprites.create(assets.image`TalkingBenPreAnimation`, SpriteKind.Ben)
        BenYesNoHoahHoahHoahUegh.z = 1000
        music.play(music.createSong(assets.song`TalkingBenSpeech`), music.PlaybackMode.InBackground)
        animation.runImageAnimation(
        BenYesNoHoahHoahHoahUegh,
        assets.animation`TalkingBenCall`,
        2000,
        false
        )
        BenYesNoHoahHoahHoahUegh.setPosition(49, 8)
        timer.after(19000, function () {
            BenYesNoHoahHoahHoahUegh.setImage(assets.image`TalkingBenPayment`)
            BenYesNoHoahHoahHoahUegh.setPosition(79, 55)
            pause(10000)
            game.setGameOverMessage(true, "Take the money I stole -Ben")
            game.gameOver(true)
        })
    }
}
browserEvents.Any.onEvent(browserEvents.KeyEvent.Pressed, function () {
    if (browserEvents.A.isPressed()) {
        if (EditorLoaded == 1) {
            if (browserEvents.S.isPressed()) {
                NoSaveWarning = sprites.create(assets.image`NoSaveWarning`, SpriteKind.Warning)
            }
            if (browserEvents.Q.isPressed()) {
                CloseTilemapEditor()
            }
            if (browserEvents.X.isPressed()) {
                sprites.destroyAllSpritesOfKind(SpriteKind.Tile)
            }
        }
    }
})
browserEvents.onMouseMove(function (x, y) {
    Mouse.setPosition(x + (scene.cameraProperty(CameraProperty.X) - 80), y + (scene.cameraProperty(CameraProperty.Y) - 60))
})
function OpenTilemapEditor () {
    EditorLoaded = 1
    sprites.destroyAllSpritesOfKind(SpriteKind.Button)
    sprites.destroyAllSpritesOfKind(SpriteKind.Misc)
    sprites.destroyAllSpritesOfKind(SpriteKind.Menu)
    sprites.destroyAllSpritesOfKind(SpriteKind.Bar)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    scroller.setLayerImage(scroller.BackgroundLayer.Layer0, assets.image`BackgroundNoWaves`)
    tiles.setCurrentTilemap(tilemap`Grid64`)
    Selector = sprites.create(assets.image`Selector`, SpriteKind.Controller)
    Selector.setFlag(SpriteFlag.GhostThroughWalls, true)
    sprites.setDataNumber(Selector, "OffsetX", 12)
    sprites.setDataNumber(Selector, "OffsetY", -100)
    Selector.z = 1
    TileBar = sprites.create(assets.image`TileMenu`, SpriteKind.Bar)
    SpecialTileBar = sprites.create(assets.image`SpecialTileBar`, SpriteKind.Bar)
    HelpMenu = sprites.create(assets.image`HelpMenu`, SpriteKind.Menu)
    NoSaveWarning = sprites.create(assets.image`NoSaveWarning`, SpriteKind.Warning)
    TestButton = sprites.create(assets.image`TestButton`, SpriteKind.Button)
    IncrediblePolo = sprites.create(assets.image`IncrediblePoloRight`, SpriteKind.Player)
    tiles.placeOnTile(IncrediblePolo, SpawnLocation)
    LoadTileImages()
}
sprites.onDestroyed(SpriteKind.Warning, function (sprite) {
    sprites.setDataBoolean(Camera, "CameraLocked", false)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Spike, function (sprite, otherSprite) {
    Die()
    pauseUntil(() => !(sprite.overlapsWith(otherSprite)))
})
sprites.onOverlap(SpriteKind.CustomMouse, SpriteKind.TileIcon, function (sprite, otherSprite) {
    if (browserEvents.MouseLeft.isPressed()) {
        sprites.setDataNumber(Selector, "OffsetX", otherSprite.x - scene.cameraProperty(CameraProperty.X) + 80)
        sprites.setDataNumber(Selector, "OffsetY", otherSprite.y - scene.cameraProperty(CameraProperty.Y) - 50)
    }
})
function OpenHelp () {
    HelpMenu = sprites.create(assets.image`ControlsHelpMenu`, SpriteKind.Menu)
    HelpMenu.setFlag(SpriteFlag.Invisible, false)
}
sprites.onCreated(SpriteKind.Warning, function (sprite) {
    SoundFX("SaveWarning")
    sprites.setDataBoolean(Camera, "CameraLocked", true)
    sprite.z = 99
    sprite.lifespan = 8500
})
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    sprites.destroyAllSpritesOfKind(SpriteKind.Warning)
    Mouse.setPosition(x + (scene.cameraProperty(CameraProperty.X) - 80), y + (scene.cameraProperty(CameraProperty.Y) - 60))
    for (let value of sprites.allOfKind(SpriteKind.Menu)) {
        if (!(Mouse.overlapsWith(value))) {
            sprites.destroyAllSpritesOfKind(SpriteKind.Menu)
        }
    }
    if (Mouse.overlapsWith(HelpButton)) {
        OpenHelp()
    }
    if (Mouse.overlapsWith(TilemapButton)) {
        DitherTransition()
        timer.after(700, function () {
            OpenTilemapEditor()
        })
    }
    if (sprites.readDataBoolean(Mouse, "Selectingdifficulty") == true) {
        if (Mouse.overlapsWith(EasyButton)) {
            DitherTransition()
            timer.after(700, function () {
                LoadLevel(1)
            })
        }
        if (Mouse.overlapsWith(MediumButton)) {
            DitherTransition()
            timer.after(700, function () {
                LoadLevel(2)
            })
        }
        if (Mouse.overlapsWith(HardButton)) {
            DitherTransition()
            timer.after(700, function () {
                LoadLevel(3)
            })
        }
        if (Mouse.overlapsWith(InsaneButton)) {
            DitherTransition()
            timer.after(700, function () {
                LoadLevel(4)
            })
        }
    }
    if (EditorLoaded == 0) {
        browserEvents.MouseLeft.pauseUntil(browserEvents.MouseButtonEvent.Pressed)
        if (Mouse.overlapsWith(CodesButton)) {
            EnterCode(game.askForString("Enter the code here", 12, false))
        }
        if (Mouse.overlapsWith(PlayButton)) {
            AskDiffuculty()
        }
    }
    if (EditorLoaded != 0) {
        if (Mouse.overlapsWith(TestButton)) {
            if (TestButton.image.equals(assets.image`TestButton`)) {
                TestButton.setImage(assets.image`TestIcon`)
                sprites.setDataBoolean(IncrediblePolo, "Flying", false)
                controller.moveSprite(IncrediblePolo, 70, 0)
                IncrediblePolo.ay = 500
                IncrediblePolo.setFlag(SpriteFlag.Ghost, false)
                TestLevel()
            } else {
                sprites.setDataBoolean(IncrediblePolo, "Flying", true)
                controller.moveSprite(IncrediblePolo, 85, 85)
                IncrediblePolo.ay = 0
                IncrediblePolo.setFlag(SpriteFlag.Ghost, true)
                OpenTilemapEditor()
                TestButton.setImage(assets.image`TestButton`)
            }
        }
    }
    if (GameLoaded == 1) {
        if (Mouse.overlapsWith(ExitButton)) {
            DitherTransition()
            timer.after(700, function () {
                sprites.destroyAllSpritesOfKind(SpriteKind.Player)
                sprites.destroyAllSpritesOfKind(SpriteKind.Bar)
                sprites.destroyAllSpritesOfKind(SpriteKind.Button)
                sprites.destroyAllSpritesOfKind(SpriteKind.Spike)
                sprites.destroyAllSpritesOfKind(SpriteKind.Checkpoint)
                LoadTitleScreen()
            })
        }
    }
    for (let value of sprites.allOfKind(SpriteKind.Button)) {
        if (Mouse.overlapsWith(value)) {
            music.play(music.createSoundEffect(
            WaveShape.Triangle,
            200,
            randint(300, 1400),
            255,
            0,
            200,
            SoundExpressionEffect.None,
            InterpolationCurve.Linear
            ), music.PlaybackMode.InBackground)
        }
    }
})
sprites.onOverlap(SpriteKind.CustomMouse, SpriteKind.Button, function (sprite, otherSprite) {
    music.play(music.createSoundEffect(
    WaveShape.Triangle,
    1,
    randint(1000, 2500),
    188,
    0,
    200,
    SoundExpressionEffect.None,
    InterpolationCurve.Linear
    ), music.PlaybackMode.InBackground)
    pauseUntil(() => !(sprite.overlapsWith(otherSprite)))
})
function LoadTileImages () {
    Path1 = sprites.create(assets.image`SandFloorIcon`, SpriteKind.TileIcon)
    Path2 = sprites.create(assets.image`SandFillerIcon`, SpriteKind.TileIcon)
    Spike1 = sprites.create(assets.image`SpikeFloorIcon`, SpriteKind.TileIcon)
    Spike2 = sprites.create(assets.image`SpikeCielingIcon`, SpriteKind.TileIcon)
    Spike3 = sprites.create(assets.image`SpikeMiniLeftIcon`, SpriteKind.TileIcon)
    Spike4 = sprites.create(assets.image`SpikeMiniRightIcon`, SpriteKind.TileIcon)
    Flag1 = sprites.create(assets.image`CheckpointIcon`, SpriteKind.TileIcon)
    EmptyTile = sprites.create(assets.image`EmptyIcon`, SpriteKind.SpecialTileIcon)
    SpawnpointTile = sprites.create(assets.image`SpawnPointTileIcon`, SpriteKind.SpecialTileIcon)
}
sprites.onCreated(SpriteKind.Player, function (sprite) {
    sprite.ay = 500
    controller.moveSprite(sprite, 70, 0)
    scene.cameraFollowSprite(sprite)
    sprites.setDataBoolean(sprite, "Flying", false)
    sprite.z = 1
})
sprites.onCreated(SpriteKind.SpecialTileIcon, function (sprite) {
    sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
})
let TileClone: Sprite = null
let SpawnpointTile: Sprite = null
let EmptyTile: Sprite = null
let Flag1: Sprite = null
let Spike4: Sprite = null
let Spike3: Sprite = null
let Spike2: Sprite = null
let Spike1: Sprite = null
let Path2: Sprite = null
let Path1: Sprite = null
let TestButton: Sprite = null
let HelpMenu: Sprite = null
let SpecialTileBar: Sprite = null
let TileBar: Sprite = null
let NoSaveWarning: Sprite = null
let ThisPerfectFormMakesMeMad: Sprite = null
let Transition: Sprite = null
let InsaneButton: Sprite = null
let HardButton: Sprite = null
let MediumButton: Sprite = null
let EasyButton: Sprite = null
let DifficultySelectMenu: Sprite = null
let CheckOutMyPerfectForm: Sprite = null
let BenYesNoHoahHoahHoahUegh: Sprite = null
let BenCoverUp: Sprite = null
let Selector: Sprite = null
let DeathBar: Sprite = null
let ClockBar: Sprite = null
let ExitButton: Sprite = null
let GoalTile: Sprite = null
let CheckpointTile: Sprite = null
let SpikeTile: Sprite = null
let CodesButton: Sprite = null
let TilemapButton: Sprite = null
let PlayButton: Sprite = null
let Title: Sprite = null
let DeathDisplay: TextSprite = null
let ClockDisplay: TextSprite = null
let IncrediblePolo: Sprite = null
let EditorLoaded = 0
let GameLoaded = 0
let SpawnLocation: tiles.Location = null
let HelpButton: Sprite = null
let Camera: Sprite = null
let Mouse: Sprite = null
game.setDialogCursor(assets.image`InvisibleSpeech1`)
game.setDialogFrame(assets.image`InvisibleSpeech2`)
scene.setBackgroundColor(6)
let Introduction = sprites.create(assets.image`Disclaimer`, SpriteKind.Text)
game.showLongText("", DialogLayout.Bottom)
Introduction.setImage(assets.image`IntroPart1`)
game.showLongText("", DialogLayout.Bottom)
Introduction.setImage(assets.image`IntroPart2`)
game.showLongText("", DialogLayout.Bottom)
Introduction.setImage(assets.image`IntroPart3`)
game.showLongText("", DialogLayout.Bottom)
Introduction.setImage(assets.image`introPart4`)
game.showLongText("", DialogLayout.Bottom)
sprites.destroy(Introduction)
Mouse = sprites.create(assets.image`MouseHitbox`, SpriteKind.CustomMouse)
sprites.setDataBoolean(Mouse, "Selectingdifficulty", false)
sprites.setDataBoolean(Mouse, "HighContrastSpikes", false)
Camera = sprites.create(assets.image`CameraGuide`, SpriteKind.CustomCamera)
sprites.setDataBoolean(Camera, "CameraLocked", true)
HelpButton = sprites.create(assets.image`HelpIcon`, SpriteKind.Button)
HelpButton.setFlag(SpriteFlag.GhostThroughWalls, true)
HelpButton.setFlag(SpriteFlag.Invisible, true)
SpawnLocation = tiles.getTileLocation(1, 13)
LoadTitleScreen()
game.onUpdate(function () {
    if (browserEvents.MouseLeft.isPressed()) {
        if (EditorLoaded == 1) {
            if (!(Mouse.overlapsWith(TileBar)) && !(Mouse.overlapsWith(TileBar))) {
                for (let value of sprites.allOfKind(SpriteKind.TileIcon)) {
                    if (value.overlapsWith(Selector)) {
                        TileClone = sprites.create(value.image, SpriteKind.Tile)
                        tiles.placeOnTile(TileClone, Mouse.tilemapLocation())
                    }
                }
                for (let value of sprites.allOfKind(SpriteKind.SpecialTileIcon)) {
                    if (value.overlapsWith(Selector)) {
                        TileClone = sprites.create(value.image, SpriteKind.Tile)
                        TileClone.z = -2
                        tiles.placeOnTile(TileClone, Mouse.tilemapLocation())
                        if (value.image.equals(assets.image`EmptyTile`)) {
                            TileClone.setFlag(SpriteFlag.Invisible, true)
                        }
                        if (value.image.equals(assets.image`SpawnPointTileIcon`)) {
                            SpawnLocation = value.tilemapLocation()
                        }
                    }
                }
            }
        }
    }
})
game.onUpdate(function () {
    HelpButton.setPosition(scene.cameraProperty(CameraProperty.X) + 65, scene.cameraProperty(CameraProperty.Y) + 53)
    for (let value of sprites.allOfKind(SpriteKind.ScreenFX)) {
        value.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
    }
    for (let value of sprites.allOfKind(SpriteKind.Warning)) {
        value.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
    }
    for (let value of sprites.allOfKind(SpriteKind.Menu)) {
        value.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
    }
    if (EditorLoaded == 1) {
        Selector.setPosition(scene.cameraProperty(CameraProperty.X) - 80 + sprites.readDataNumber(Selector, "OffsetX"), scene.cameraProperty(CameraProperty.Y) + 50 + sprites.readDataNumber(Selector, "OffsetY"))
        TileBar.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y) + 50)
        SpecialTileBar.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y) - 50)
        HelpMenu.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y) + 4)
        Path1.x = scene.cameraProperty(CameraProperty.X) - 68
        Path2.x = scene.cameraProperty(CameraProperty.X) - 51
        Spike1.x = scene.cameraProperty(CameraProperty.X) - 34
        Spike2.x = scene.cameraProperty(CameraProperty.X) - 17
        Spike3.x = scene.cameraProperty(CameraProperty.X) - 0
        Spike4.x = scene.cameraProperty(CameraProperty.X) + 17
        Flag1.x = scene.cameraProperty(CameraProperty.X) + 34
        EmptyTile.x = scene.cameraProperty(CameraProperty.X) - 68
        SpawnpointTile.x = scene.cameraProperty(CameraProperty.X) - 51
    }
    if (EditorLoaded != 0) {
        TestButton.setPosition(scene.cameraProperty(CameraProperty.X) + 65, scene.cameraProperty(CameraProperty.Y) - 53)
    }
    if (GameLoaded == 1) {
        ExitButton.setPosition(scene.cameraProperty(CameraProperty.X) - 72, scene.cameraProperty(CameraProperty.Y) - 52)
        ClockBar.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y) + 54)
        ClockDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 62, scene.cameraProperty(CameraProperty.Y) + 53)
        DeathBar.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y) + 42)
        DeathDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 62, scene.cameraProperty(CameraProperty.Y) + 41)
        if (sprites.readDataNumber(ClockDisplay, "ClockLength") == 1) {
            ClockDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 62, scene.cameraProperty(CameraProperty.Y) + 53)
        } else if (sprites.readDataNumber(ClockDisplay, "ClockLength") == 2) {
            ClockDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 60, scene.cameraProperty(CameraProperty.Y) + 53)
        } else if (sprites.readDataNumber(ClockDisplay, "ClockLength") == 3) {
            ClockDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 57, scene.cameraProperty(CameraProperty.Y) + 53)
        } else if (sprites.readDataNumber(ClockDisplay, "ClockLength") == 4) {
            ClockDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 54, scene.cameraProperty(CameraProperty.Y) + 53)
        } else if (sprites.readDataNumber(ClockDisplay, "ClockLength") == 5) {
            ClockDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 51, scene.cameraProperty(CameraProperty.Y) + 53)
        }
        if (sprites.readDataNumber(DeathDisplay, "DeathLength") == 1) {
            DeathDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 62, scene.cameraProperty(CameraProperty.Y) + 41)
        } else if (sprites.readDataNumber(DeathDisplay, "DeathLength") == 2) {
            DeathDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 60, scene.cameraProperty(CameraProperty.Y) + 41)
        } else if (sprites.readDataNumber(DeathDisplay, "DeathLength") == 3) {
            DeathDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 57, scene.cameraProperty(CameraProperty.Y) + 41)
        } else if (sprites.readDataNumber(DeathDisplay, "DeathLength") == 4) {
            DeathDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 54, scene.cameraProperty(CameraProperty.Y) + 41)
        } else if (sprites.readDataNumber(DeathDisplay, "DeathLength") == 5) {
            DeathDisplay.setPosition(scene.cameraProperty(CameraProperty.X) - 51, scene.cameraProperty(CameraProperty.Y) + 41)
        }
    }
})
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.Tile)) {
        if (value.image.equals(assets.image`SandFloorIcon`) || value.image.equals(assets.image`SandFillerIcon`)) {
            tiles.setWallAt(value.tilemapLocation(), true)
        } else {
            tiles.setWallAt(value.tilemapLocation(), false)
        }
    }
})
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.TileIcon)) {
        value.y = scene.cameraProperty(CameraProperty.Y) + 50
    }
    for (let value of sprites.allOfKind(SpriteKind.SpecialTileIcon)) {
        value.y = scene.cameraProperty(CameraProperty.Y) - 50
        value.setFlag(SpriteFlag.Invisible, false)
    }
})
game.onUpdate(function () {
    if ((GameLoaded == 1 || EditorLoaded != 0) && sprites.readDataBoolean(IncrediblePolo, "Dead") == false) {
        if (controller.up.isPressed() || controller.A.isPressed()) {
            if (IncrediblePolo.isHittingTile(CollisionDirection.Bottom) || IncrediblePolo.isHittingTile(CollisionDirection.Top)) {
                IncrediblePolo.vy += -100
            } else {
                if (IncrediblePolo.vy > -250) {
                    IncrediblePolo.vy += -8
                }
            }
        }
    }
})
game.onUpdate(function () {
    scroller.setBackgroundScrollOffset(sprites.readDataNumber(Camera, "BackgroundMovement") * 4, Math.sin(sprites.readDataNumber(Camera, "BackgroundMovement")) * 2)
    sprites.changeDataNumberBy(Camera, "BackgroundMovement", 0.05)
})
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.Button)) {
        if (Mouse.overlapsWith(value)) {
            value.image.replace(10, 7)
        } else {
            value.image.replace(7, 10)
        }
    }
})
game.onUpdateInterval(1000, function () {
    if (sprites.readDataBoolean(ClockDisplay, "RunClock") == true) {
        timer.after(1000, function () {
            sprites.changeDataNumberBy(ClockDisplay, "Time", 1)
            ClockDisplay.setText(convertToText(sprites.readDataNumber(ClockDisplay, "Time")))
            sprites.setDataNumber(ClockDisplay, "ClockLength", convertToText(sprites.readDataNumber(ClockDisplay, "Time")).length)
        })
    }
})
