// 登录场景
class LoginScene extends Phaser.Scene {
  constructor() {
    super('LoginScene')
  }

  preload() {
    // 加载登录界面图片
    this.load.image('loginBg', 'image/background/login_bg.png')
    this.load.image('logo', 'image/logo.png')
    this.load.image('qqButton', 'image/QQ.png')
    this.load.image('wechatButton', 'image/WECHAT.png')
    this.load.image('musicOn', 'image/music-on.png')
    this.load.image('musicOff', 'image/music-off.png')
    
    // 加载背景音乐
    this.load.audio('backgroundMusic', 'desktop.mp3')
  }

  create() {
    // 添加背景图片
    this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'loginBg')
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)

    // 定义左侧边距常量，确保logo和版本号对齐
    const leftMargin = 80

    // 添加logo到左上角
    const logo = this.add.image(leftMargin, 60, 'logo')
      .setScale(0.8)

    // 计算按钮位置（下四分之一部分）
    const buttonY = this.sys.game.config.height * 3/4
    const buttonGap = 32 // 按钮之间的间隙
    const buttonScale = 0.8

    // 加载按钮图片以获取尺寸
    const qqButtonWidth = this.textures.get('qqButton').getSourceImage().width * buttonScale
    const wechatButtonWidth = this.textures.get('wechatButton').getSourceImage().width * buttonScale

    // 计算按钮的水平位置，使其居中
    const totalWidth = qqButtonWidth + buttonGap + wechatButtonWidth
    const startX = (this.sys.game.config.width - totalWidth) / 2

    // 添加QQ登录按钮
    const qqButton = this.add.image(startX + qqButtonWidth / 2, buttonY, 'qqButton')
      .setInteractive()
      .setScale(buttonScale)
    qqButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene')
    })

    // 添加微信登录按钮
    const wechatButton = this.add.image(startX + qqButtonWidth + buttonGap + wechatButtonWidth / 2, buttonY, 'wechatButton')
      .setInteractive()
      .setScale(buttonScale)
    wechatButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene')
    })

    // 添加版本信息到左下角，使用相同的左侧边距
    this.add.text(leftMargin, this.sys.game.config.height - 50, '开发中版本, 不代表最终品质', {
      fontSize: '12px',
      fill: '#ffffff'
    })

    this.add.text(leftMargin, this.sys.game.config.height - 30, '游戏版本号: 0.1.140483', {
      fontSize: '12px',
      fill: '#ffffff'
    })

    // 播放背景音乐
    if (!this.sound.get('backgroundMusic')) {
      this.backgroundMusic = this.sound.add('backgroundMusic', {
        loop: true,
        volume: 0.5
      })
      this.backgroundMusic.play()
    } else {
      this.backgroundMusic = this.sound.get('backgroundMusic')
    }

    // 添加音乐开关按钮
    this.musicOn = true
    this.musicButton = this.add.image(this.sys.game.config.width - 50, 50, 'musicOn')
      .setInteractive()
      .setScale(0.5)
    this.musicButton.on('pointerdown', () => {
      this.toggleMusic()
    })
  }

  toggleMusic() {
    this.musicOn = !this.musicOn
    if (this.musicOn) {
      this.backgroundMusic.play()
      this.musicButton.setTexture('musicOn')
    } else {
      this.backgroundMusic.pause()
      this.musicButton.setTexture('musicOff')
    }
  }
}

// 关卡选择场景
class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene')
  }

  preload() {
    // 加载背景图片
    this.load.image('gameBg', 'image/background/game_bg.png')
    this.load.image('musicOn', 'image/music-on.png')
    this.load.image('musicOff', 'image/music-off.png')
  }

  create() {
    // 添加背景图片
    this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'gameBg')
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)
    
    // 添加半透明纯色背景覆盖层，突出显示界面元素
    this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x1a1a2e, 0.8).setOrigin(0, 0)

    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, 100, '选择关卡', {
      fontSize: '32px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    // 标题进入动画
    title.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 600,
      ease: 'Back.easeOut'
    })

    // 添加返回按钮
    const backButton = this.add.text(50, 50, '返回', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: 0x000000,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    backButton.setInteractive()
    backButton.on('pointerdown', () => {
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('LoginScene')
      })
    })
    // 按钮悬停效果
    backButton.on('pointerover', () => {
      backButton.setBackgroundColor(0x333333)
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor(0x000000)
      this.tweens.add({
        targets: backButton,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    backButton.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: backButton,
      x: 50,
      alpha: 1,
      duration: 500,
      delay: 100,
      ease: 'Power2.easeOut'
    })

    // 添加设置按钮
    const settingsButton = this.add.text(this.sys.game.config.width - 150, 50, '设置', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: 0x000000,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    settingsButton.setInteractive()
    settingsButton.on('pointerdown', () => {
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('SettingsScene')
      })
    })
    // 按钮悬停效果
    settingsButton.on('pointerover', () => {
      settingsButton.setBackgroundColor(0x333333)
      this.tweens.add({
        targets: settingsButton,
        scale: 1.05,
        duration: 100
      })
    })
    settingsButton.on('pointerout', () => {
      settingsButton.setBackgroundColor(0x000000)
      this.tweens.add({
        targets: settingsButton,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    settingsButton.setX(this.sys.game.config.width + 100).setAlpha(0)
    this.tweens.add({
      targets: settingsButton,
      x: this.sys.game.config.width - 150,
      alpha: 1,
      duration: 500,
      delay: 100,
      ease: 'Power2.easeOut'
    })

    // 添加音乐开关按钮
    this.backgroundMusic = this.sound.get('backgroundMusic')
    this.musicOn = this.backgroundMusic && this.backgroundMusic.isPlaying
    this.musicButton = this.add.image(this.sys.game.config.width - 50, 50, this.musicOn ? 'musicOn' : 'musicOff')
      .setInteractive()
      .setScale(0.5)
    this.musicButton.on('pointerdown', () => {
      this.toggleMusic()
      // 按钮点击动画
      this.tweens.add({
        targets: this.musicButton,
        scale: 0.4,
        duration: 100,
        yoyo: true,
        repeat: 1
      })
    })
    // 按钮进入动画
    this.musicButton.setX(this.sys.game.config.width + 100).setAlpha(0)
    this.tweens.add({
      targets: this.musicButton,
      x: this.sys.game.config.width - 50,
      alpha: 1,
      duration: 500,
      delay: 150,
      ease: 'Power2.easeOut'
    })

    // 添加关卡按钮
    const levelButtons = []
    for (let i = 0; i < 3; i++) {
      const button = this.add.text(this.sys.game.config.width / 2, 200 + i * 100, `关卡 ${i + 1}`, {
        fontSize: '24px',
        fill: '#ffffff',
        backgroundColor: 0x3498db,
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
      }).setOrigin(0.5)
      button.setInteractive()
      button.on('pointerdown', () => {
        // 场景退出动画
        this.cameras.main.fadeOut(300)
        this.time.delayedCall(300, () => {
          this.scene.start('GameScene', { level: i + 1 })
        })
      })
      // 按钮悬停效果
      button.on('pointerover', () => {
        button.setBackgroundColor(0x2980b9)
        this.tweens.add({
          targets: button,
          scale: 1.05,
          duration: 100
        })
      })
      button.on('pointerout', () => {
        button.setBackgroundColor(0x3498db)
        this.tweens.add({
          targets: button,
          scale: 1,
          duration: 100
        })
      })
      // 按钮进入动画
      button.setY(700).setAlpha(0)
      this.tweens.add({
        targets: button,
        y: 200 + i * 100,
        alpha: 1,
        duration: 500,
        delay: 200 + i * 100,
        ease: 'Bounce.easeOut'
      })
      levelButtons.push(button)
    }

    // 添加自定义关卡按钮
    const customButton = this.add.text(this.sys.game.config.width / 2, 500, '自定义关卡', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x9b59b6,
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5)
    customButton.setInteractive()
    customButton.on('pointerdown', () => {
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('CustomLevelScene')
      })
    })
    // 按钮悬停效果
    customButton.on('pointerover', () => {
      customButton.setBackgroundColor(0x8e44ad)
      this.tweens.add({
        targets: customButton,
        scale: 1.05,
        duration: 100
      })
    })
    customButton.on('pointerout', () => {
      customButton.setBackgroundColor(0x9b59b6)
      this.tweens.add({
        targets: customButton,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    customButton.setY(700).setAlpha(0)
    this.tweens.add({
      targets: customButton,
      y: 500,
      alpha: 1,
      duration: 500,
      delay: 500,
      ease: 'Bounce.easeOut'
    })
    
    // 场景进入动画
    this.cameras.main.fadeIn(500)
  }

  toggleMusic() {
    this.musicOn = !this.musicOn
    const backgroundMusic = this.sound.get('backgroundMusic')
    if (backgroundMusic) {
      if (this.musicOn) {
        backgroundMusic.play()
        this.musicButton.setTexture('musicOn')
      } else {
        backgroundMusic.pause()
        this.musicButton.setTexture('musicOff')
      }
    }
  }
}

// 自定义关卡场景
class CustomLevelScene extends Phaser.Scene {
  constructor() {
    super('CustomLevelScene')
    this.boardWidth = 8
    this.boardHeight = 8
    this.moves = 30
    this.blockTypes = 6
  }

  preload() {
    // 加载背景图片
    this.load.image('gameBg', 'image/background/game_bg.jpg')
    this.load.image('musicOn', 'image/music-on.png')
    this.load.image('musicOff', 'image/music-off.png')
  }

  create() {
    // 添加背景图片
    this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'gameBg')
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)
    
    // 添加半透明纯色背景覆盖层，突出显示界面元素
    this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x1a1a2e, 0.8).setOrigin(0, 0)

    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, 100, '自定义关卡', {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    // 标题进入动画
    title.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 600,
      ease: 'Back.easeOut'
    })

    // 添加返回按钮
    const backButton = this.add.text(50, 50, '返回', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: 0x000000,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    backButton.setInteractive()
    backButton.on('pointerdown', () => {
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('LevelSelectScene')
      })
    })
    // 按钮悬停效果
    backButton.on('pointerover', () => {
      backButton.setBackgroundColor(0x333333)
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor(0x000000)
      this.tweens.add({
        targets: backButton,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    backButton.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: backButton,
      x: 50,
      alpha: 1,
      duration: 500,
      delay: 100,
      ease: 'Power2.easeOut'
    })

    // 添加音乐开关按钮
    this.backgroundMusic = this.sound.get('backgroundMusic')
    this.musicOn = this.backgroundMusic && this.backgroundMusic.isPlaying
    this.musicButton = this.add.image(this.sys.game.config.width - 50, 50, this.musicOn ? 'musicOn' : 'musicOff')
      .setInteractive()
      .setScale(0.5)
    this.musicButton.on('pointerdown', () => {
      this.toggleMusic()
      // 按钮点击动画
      this.tweens.add({
        targets: this.musicButton,
        scale: 0.4,
        duration: 100,
        yoyo: true,
        repeat: 1
      })
    })
    // 按钮进入动画
    this.musicButton.setX(this.sys.game.config.width + 100).setAlpha(0)
    this.tweens.add({
      targets: this.musicButton,
      x: this.sys.game.config.width - 50,
      alpha: 1,
      duration: 500,
      delay: 150,
      ease: 'Power2.easeOut'
    })

    // 添加游戏板宽度设置
    const widthLabel = this.add.text(300, 200, '游戏板宽度:', {
      fontSize: '20px',
      fill: '#ffffff'
    })
    // 标签进入动画
    widthLabel.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: widthLabel,
      x: 300,
      alpha: 1,
      duration: 500,
      delay: 200,
      ease: 'Power2.easeOut'
    })
    
    const widthMinus = this.add.text(450, 200, '-', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x34495e,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    widthMinus.setInteractive()
    widthMinus.on('pointerdown', () => {
      if (this.boardWidth > 5) {
        this.boardWidth--
        this.widthText.setText(this.boardWidth)
        // 数值变化动画
        this.tweens.add({
          targets: this.widthText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    // 按钮悬停效果
    widthMinus.on('pointerover', () => {
      widthMinus.setBackgroundColor(0x2c3e50)
      this.tweens.add({
        targets: widthMinus,
        scale: 1.05,
        duration: 100
      })
    })
    widthMinus.on('pointerout', () => {
      widthMinus.setBackgroundColor(0x34495e)
      this.tweens.add({
        targets: widthMinus,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    widthMinus.setX(450).setY(300).setAlpha(0)
    this.tweens.add({
      targets: widthMinus,
      y: 200,
      alpha: 1,
      duration: 500,
      delay: 250,
      ease: 'Bounce.easeOut'
    })

    this.widthText = this.add.text(500, 200, this.boardWidth, {
      fontSize: '24px',
      fill: '#ffffff'
    })
    // 文本进入动画
    this.widthText.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: this.widthText,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: 'Back.easeOut'
    })

    const widthPlus = this.add.text(550, 200, '+', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x34495e,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    widthPlus.setInteractive()
    widthPlus.on('pointerdown', () => {
      if (this.boardWidth < 10) {
        this.boardWidth++
        this.widthText.setText(this.boardWidth)
        // 数值变化动画
        this.tweens.add({
          targets: this.widthText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    // 按钮悬停效果
    widthPlus.on('pointerover', () => {
      widthPlus.setBackgroundColor(0x2c3e50)
      this.tweens.add({
        targets: widthPlus,
        scale: 1.05,
        duration: 100
      })
    })
    widthPlus.on('pointerout', () => {
      widthPlus.setBackgroundColor(0x34495e)
      this.tweens.add({
        targets: widthPlus,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    widthPlus.setX(550).setY(300).setAlpha(0)
    this.tweens.add({
      targets: widthPlus,
      y: 200,
      alpha: 1,
      duration: 500,
      delay: 350,
      ease: 'Bounce.easeOut'
    })

    // 添加游戏板高度设置
    const heightLabel = this.add.text(300, 250, '游戏板高度:', {
      fontSize: '20px',
      fill: '#ffffff'
    })
    // 标签进入动画
    heightLabel.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: heightLabel,
      x: 300,
      alpha: 1,
      duration: 500,
      delay: 400,
      ease: 'Power2.easeOut'
    })
    
    const heightMinus = this.add.text(450, 250, '-', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x34495e,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    heightMinus.setInteractive()
    heightMinus.on('pointerdown', () => {
      if (this.boardHeight > 5) {
        this.boardHeight--
        this.heightText.setText(this.boardHeight)
        // 数值变化动画
        this.tweens.add({
          targets: this.heightText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    // 按钮悬停效果
    heightMinus.on('pointerover', () => {
      heightMinus.setBackgroundColor(0x2c3e50)
      this.tweens.add({
        targets: heightMinus,
        scale: 1.05,
        duration: 100
      })
    })
    heightMinus.on('pointerout', () => {
      heightMinus.setBackgroundColor(0x34495e)
      this.tweens.add({
        targets: heightMinus,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    heightMinus.setX(450).setY(350).setAlpha(0)
    this.tweens.add({
      targets: heightMinus,
      y: 250,
      alpha: 1,
      duration: 500,
      delay: 450,
      ease: 'Bounce.easeOut'
    })

    this.heightText = this.add.text(500, 250, this.boardHeight, {
      fontSize: '24px',
      fill: '#ffffff'
    })
    // 文本进入动画
    this.heightText.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: this.heightText,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 500,
      ease: 'Back.easeOut'
    })

    const heightPlus = this.add.text(550, 250, '+', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x34495e,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    heightPlus.setInteractive()
    heightPlus.on('pointerdown', () => {
      if (this.boardHeight < 10) {
        this.boardHeight++
        this.heightText.setText(this.boardHeight)
        // 数值变化动画
        this.tweens.add({
          targets: this.heightText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    // 按钮悬停效果
    heightPlus.on('pointerover', () => {
      heightPlus.setBackgroundColor(0x2c3e50)
      this.tweens.add({
        targets: heightPlus,
        scale: 1.05,
        duration: 100
      })
    })
    heightPlus.on('pointerout', () => {
      heightPlus.setBackgroundColor(0x34495e)
      this.tweens.add({
        targets: heightPlus,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    heightPlus.setX(550).setY(350).setAlpha(0)
    this.tweens.add({
      targets: heightPlus,
      y: 250,
      alpha: 1,
      duration: 500,
      delay: 550,
      ease: 'Bounce.easeOut'
    })

    const movesLabel = this.add.text(300, 300, '剩余步数:', {
      fontSize: '20px',
      fill: '#ffffff'
    })
    // 标签进入动画
    movesLabel.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: movesLabel,
      x: 300,
      alpha: 1,
      duration: 500,
      delay: 600,
      ease: 'Power2.easeOut'
    })
    
    const movesMinus = this.add.text(450, 300, '-', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x34495e,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    movesMinus.setInteractive()
    movesMinus.on('pointerdown', () => {
      if (this.moves > 10) {
        this.moves -= 5
        this.movesText.setText(this.moves)
        // 数值变化动画
        this.tweens.add({
          targets: this.movesText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    // 按钮悬停效果
    movesMinus.on('pointerover', () => {
      movesMinus.setBackgroundColor(0x2c3e50)
      this.tweens.add({
        targets: movesMinus,
        scale: 1.05,
        duration: 100
      })
    })
    movesMinus.on('pointerout', () => {
      movesMinus.setBackgroundColor(0x34495e)
      this.tweens.add({
        targets: movesMinus,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    movesMinus.setX(450).setY(400).setAlpha(0)
    this.tweens.add({
      targets: movesMinus,
      y: 300,
      alpha: 1,
      duration: 500,
      delay: 650,
      ease: 'Bounce.easeOut'
    })

    this.movesText = this.add.text(500, 300, this.moves, {
      fontSize: '24px',
      fill: '#ffffff'
    })
    // 文本进入动画
    this.movesText.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: this.movesText,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 700,
      ease: 'Back.easeOut'
    })

    const movesPlus = this.add.text(550, 300, '+', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x34495e,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    movesPlus.setInteractive()
    movesPlus.on('pointerdown', () => {
      if (this.moves < 100) {
        this.moves += 5
        this.movesText.setText(this.moves)
        // 数值变化动画
        this.tweens.add({
          targets: this.movesText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    // 按钮悬停效果
    movesPlus.on('pointerover', () => {
      movesPlus.setBackgroundColor(0x2c3e50)
      this.tweens.add({
        targets: movesPlus,
        scale: 1.05,
        duration: 100
      })
    })
    movesPlus.on('pointerout', () => {
      movesPlus.setBackgroundColor(0x34495e)
      this.tweens.add({
        targets: movesPlus,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    movesPlus.setX(550).setY(400).setAlpha(0)
    this.tweens.add({
      targets: movesPlus,
      y: 300,
      alpha: 1,
      duration: 500,
      delay: 750,
      ease: 'Bounce.easeOut'
    })

    const typesLabel = this.add.text(300, 350, '方块类型:', {
      fontSize: '20px',
      fill: '#ffffff'
    })
    // 标签进入动画
    typesLabel.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: typesLabel,
      x: 300,
      alpha: 1,
      duration: 500,
      delay: 800,
      ease: 'Power2.easeOut'
    })
    
    const typesMinus = this.add.text(450, 350, '-', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x34495e,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    typesMinus.setInteractive()
    typesMinus.on('pointerdown', () => {
      if (this.blockTypes > 3) {
        this.blockTypes--
        this.typesText.setText(this.blockTypes)
        // 数值变化动画
        this.tweens.add({
          targets: this.typesText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    // 按钮悬停效果
    typesMinus.on('pointerover', () => {
      typesMinus.setBackgroundColor(0x2c3e50)
      this.tweens.add({
        targets: typesMinus,
        scale: 1.05,
        duration: 100
      })
    })
    typesMinus.on('pointerout', () => {
      typesMinus.setBackgroundColor(0x34495e)
      this.tweens.add({
        targets: typesMinus,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    typesMinus.setX(450).setY(450).setAlpha(0)
    this.tweens.add({
      targets: typesMinus,
      y: 350,
      alpha: 1,
      duration: 500,
      delay: 850,
      ease: 'Bounce.easeOut'
    })

    this.typesText = this.add.text(500, 350, this.blockTypes, {
      fontSize: '24px',
      fill: '#ffffff'
    })
    // 文本进入动画
    this.typesText.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: this.typesText,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 900,
      ease: 'Back.easeOut'
    })

    const typesPlus = this.add.text(550, 350, '+', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x34495e,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    typesPlus.setInteractive()
    typesPlus.on('pointerdown', () => {
      if (this.blockTypes < 8) {
        this.blockTypes++
        this.typesText.setText(this.blockTypes)
        // 数值变化动画
        this.tweens.add({
          targets: this.typesText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    // 按钮悬停效果
    typesPlus.on('pointerover', () => {
      typesPlus.setBackgroundColor(0x2c3e50)
      this.tweens.add({
        targets: typesPlus,
        scale: 1.05,
        duration: 100
      })
    })
    typesPlus.on('pointerout', () => {
      typesPlus.setBackgroundColor(0x34495e)
      this.tweens.add({
        targets: typesPlus,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    typesPlus.setX(550).setY(450).setAlpha(0)
    this.tweens.add({
      targets: typesPlus,
      y: 350,
      alpha: 1,
      duration: 500,
      delay: 950,
      ease: 'Bounce.easeOut'
    })

    // 添加开始游戏按钮
    const startButton = this.add.text(this.sys.game.config.width / 2, 450, '开始游戏', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x27ae60,
      padding: { left: 30, right: 30, top: 15, bottom: 15 }
    }).setOrigin(0.5)
    startButton.setInteractive()
    startButton.on('pointerdown', () => {
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('GameScene', {
          level: 0,
          custom: true,
          boardWidth: this.boardWidth,
          boardHeight: this.boardHeight,
          moves: this.moves,
          blockTypes: this.blockTypes
        })
      })
    })
    // 按钮悬停效果
    startButton.on('pointerover', () => {
      startButton.setBackgroundColor(0x229954)
      this.tweens.add({
        targets: startButton,
        scale: 1.05,
        duration: 100
      })
    })
    startButton.on('pointerout', () => {
      startButton.setBackgroundColor(0x27ae60)
      this.tweens.add({
        targets: startButton,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    startButton.setY(600).setAlpha(0)
    this.tweens.add({
      targets: startButton,
      y: 450,
      alpha: 1,
      duration: 600,
      delay: 1000,
      ease: 'Bounce.easeOut'
    })
    
    // 场景进入动画
    this.cameras.main.fadeIn(500)
  }

  toggleMusic() {
    this.musicOn = !this.musicOn
    const backgroundMusic = this.sound.get('backgroundMusic')
    if (backgroundMusic) {
      if (this.musicOn) {
        backgroundMusic.play()
        this.musicButton.setTexture('musicOn')
      } else {
        backgroundMusic.pause()
        this.musicButton.setTexture('musicOff')
      }
    }
  }
}

// 游戏主场景
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
    this.board = []
    this.blockSize = 70
    this.boardWidth = 8
    this.boardHeight = 8
    this.score = 0
    this.scoreTarget = 0
    this.moves = 30
    this.selectedBlock = null
    this.blocks = []
    this.blockTypes = 4
    this.blockImages = ['nana7mi', 'shizukululu', 'taffy', 'xingtong']
  }

  preload() {
    // 加载背景图片
    this.load.image('gameBg', 'image/background/game_bg.jpg')
    
    // 加载方块图片
    for (let i = 0; i < this.blockImages.length; i++) {
      this.load.image(`block${i + 1}`, `image/block/${this.blockImages[i]}.png`)
    }
    
    // 加载音乐开关按钮图片
    this.load.image('musicOn', 'image/music-on.png')
    this.load.image('musicOff', 'image/music-off.png')
  }

  create(data) {
    // 重置方块数组
    this.blocks = []
    
    // 添加背景图片
    this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'gameBg')
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)
    
    // 添加半透明纯色背景覆盖层，突出显示游戏元素
    this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x1a1a2e, 0.7).setOrigin(0, 0)

    // 检查是否有自定义参数
    if (data.custom) {
      this.boardWidth = data.boardWidth || 8
      this.boardHeight = data.boardHeight || 8
      this.moves = data.moves || 30
      this.blockTypes = data.blockTypes || 6
    }

    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, 50, data.custom ? `游戏界面 - 自定义关卡` : `游戏界面 - 关卡 ${data.level}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    // 标题进入动画
    title.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 600,
      ease: 'Back.easeOut'
    })

    // 添加返回按钮
    const backButton = this.add.text(50, 50, '返回', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: 0x000000,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    backButton.setInteractive()
    backButton.on('pointerdown', () => {
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('LevelSelectScene')
      })
    })
    // 按钮悬停效果
    backButton.on('pointerover', () => {
      backButton.setBackgroundColor(0x333333)
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor(0x000000)
      this.tweens.add({
        targets: backButton,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    backButton.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: backButton,
      x: 50,
      alpha: 1,
      duration: 500,
      delay: 100,
      ease: 'Power2.easeOut'
    })

    // 添加音乐开关按钮
    this.backgroundMusic = this.sound.get('backgroundMusic')
    this.musicOn = this.backgroundMusic && this.backgroundMusic.isPlaying
    this.musicButton = this.add.image(this.sys.game.config.width - 50, 50, this.musicOn ? 'musicOn' : 'musicOff')
      .setInteractive()
      .setScale(0.5)
    this.musicButton.on('pointerdown', () => {
      this.toggleMusic()
      // 按钮点击动画
      this.tweens.add({
        targets: this.musicButton,
        scale: 0.4,
        duration: 100,
        yoyo: true,
        repeat: 1
      })
    })
    // 按钮进入动画
    this.musicButton.setX(this.sys.game.config.width + 100).setAlpha(0)
    this.tweens.add({
      targets: this.musicButton,
      x: this.sys.game.config.width - 50,
      alpha: 1,
      duration: 500,
      delay: 150,
      ease: 'Power2.easeOut'
    })

    // 设置分数目标
    if (data.custom) {
      // 自定义关卡的分数目标
      this.scoreTarget = this.boardWidth * this.boardHeight * this.blockTypes * 5
    } else {
      // 不同关卡的分数目标
      const level = data.level || 1
      this.scoreTarget = level * 500
    }

    // 添加分数显示
    this.scoreText = this.add.text(100, 100, `分数: ${this.score}/${this.scoreTarget}`, {
      fontSize: '20px',
      fill: '#ffffff'
    })
    // 分数显示进入动画
    this.scoreText.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: this.scoreText,
      x: 100,
      alpha: 1,
      duration: 500,
      delay: 200,
      ease: 'Power2.easeOut'
    })

    // 添加剩余步数显示
    this.movesText = this.add.text(100, 130, `剩余步数: ${this.moves}`, {
      fontSize: '20px',
      fill: '#ffffff'
    })
    // 步数显示进入动画
    this.movesText.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: this.movesText,
      x: 100,
      alpha: 1,
      duration: 500,
      delay: 250,
      ease: 'Power2.easeOut'
    })

    // 添加分数目标显示
    this.scoreTargetText = this.add.text(100, 160, `目标分数: ${this.scoreTarget}`, {
      fontSize: '20px',
      fill: '#ffffff'
    })
    // 分数目标显示进入动画
    this.scoreTargetText.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: this.scoreTargetText,
      x: 100,
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: 'Power2.easeOut'
    })

    // 计算游戏区域位置
    this.boardX = (this.sys.game.config.width - this.boardWidth * this.blockSize) / 2
    this.boardY = 150

    // 初始化游戏板
    this.initBoard()

    // 生成方块
    this.generateBlocks()

    // 监听鼠标点击
    this.input.on('pointerdown', this.onPointerDown, this)
    
    // 场景进入动画
    this.cameras.main.fadeIn(500)
  }

  destroy() {
    // 移除事件监听器
    this.input.off('pointerdown', this.onPointerDown, this)
    super.destroy()
  }

  initBoard() {
    // 初始化游戏板数组
    for (let y = 0; y < this.boardHeight; y++) {
      this.board[y] = []
      for (let x = 0; x < this.boardWidth; x++) {
        this.board[y][x] = 0
      }
    }
  }

  generateBlocks() {
    // 生成方块
    for (let y = 0; y < this.boardHeight; y++) {
      for (let x = 0; x < this.boardWidth; x++) {
        let blockType
        do {
          blockType = Phaser.Math.Between(1, this.blockTypes)
        } while (this.checkThreeInARow(x, y, blockType))

        this.board[y][x] = blockType
        // 使用图片创建方块
        const block = this.add.image(
          this.boardX + x * this.blockSize + this.blockSize / 2,
          this.boardY - 100, // 从上方生成
          `block${blockType}`
        )
        block.setDisplaySize(this.blockSize * 0.8, this.blockSize * 0.8)
        block.setData('x', x)
        block.setData('y', y)
        block.setData('type', blockType)
        block.setInteractive()
        this.blocks.push(block)
        
        // 添加方块生成动画
        this.tweens.add({
          targets: block,
          y: this.boardY + y * this.blockSize + this.blockSize / 2,
          duration: 500,
          delay: y * 50 + x * 10, // 交错动画
          ease: 'Bounce.easeOut'
        })
      }
    }
  }

  checkThreeInARow(x, y, type) {
    // 检查横向是否有三个相同的
    let count = 1
    for (let i = x - 1; i >= 0; i--) {
      if (this.board[y][i] === type) {
        count++
      } else {
        break
      }
    }
    for (let i = x + 1; i < this.boardWidth; i++) {
      if (this.board[y][i] === type) {
        count++
      } else {
        break
      }
    }
    if (count >= 3) {
      return true
    }

    // 检查纵向是否有三个相同的
    count = 1
    for (let i = y - 1; i >= 0; i--) {
      if (this.board[i][x] === type) {
        count++
      } else {
        break
      }
    }
    for (let i = y + 1; i < this.boardHeight; i++) {
      if (this.board[i][x] === type) {
        count++
      } else {
        break
      }
    }
    if (count >= 3) {
      return true
    }

    return false
  }

  onPointerDown(pointer) {
    // 处理鼠标点击
    for (const block of this.blocks) {
      if (block.getBounds().contains(pointer.x, pointer.y)) {
        if (this.selectedBlock) {
          // 检查是否可以交换
          if (this.canSwap(this.selectedBlock, block)) {
            this.swapBlocks(this.selectedBlock, block)
          } else {
            // 取消选择
            this.selectedBlock = block
            this.updateBlockSelection()
          }
        } else {
          // 选择方块
          this.selectedBlock = block
          this.updateBlockSelection()
        }
        break
      }
    }
  }

  canSwap(block1, block2) {
    // 检查两个方块是否相邻
    const x1 = block1.getData('x')
    const y1 = block1.getData('y')
    const x2 = block2.getData('x')
    const y2 = block2.getData('y')

    const dx = Math.abs(x1 - x2)
    const dy = Math.abs(y1 - y2)

    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1)
  }

  swapBlocks(block1, block2) {
    // 交换两个方块的位置和类型
    const x1 = block1.getData('x')
    const y1 = block1.getData('y')
    const x2 = block2.getData('x')
    const y2 = block2.getData('y')
    const type1 = block1.getData('type')
    const type2 = block2.getData('type')

    // 交换游戏板中的数据
    this.board[y1][x1] = type2
    this.board[y2][x2] = type1

    // 交换方块的位置
    const tempX = block1.x
    const tempY = block1.y

    this.tweens.add({
      targets: block1,
      x: block2.x,
      y: block2.y,
      duration: 200,
      onComplete: () => {
        this.tweens.add({
          targets: block2,
          x: tempX,
          y: tempY,
          duration: 200,
          onComplete: () => {
            // 更新方块的数据
            block1.setData('x', x2)
            block1.setData('y', y2)
            block1.setData('type', type2)
            block1.setTexture(`block${type2}`)

            block2.setData('x', x1)
            block2.setData('y', y1)
            block2.setData('type', type1)
            block2.setTexture(`block${type1}`)

            // 检查是否有消除
            const matches = this.checkMatches()
            if (matches.length > 0) {
              this.removeMatches(matches)
              this.moves--
              this.movesText.setText(`剩余步数: ${this.moves}`)
              // 添加步数变化动画
              this.tweens.add({
                targets: this.movesText,
                scale: 1.2,
                duration: 200,
                yoyo: true,
                repeat: 1
              })
              if (this.moves <= 0) {
                this.gameOver()
              }
            } else {
              // 检查是否是相同类型的方块
              if (type1 === type2) {
                // 相同类型的方块，允许交换
                this.moves--
                this.movesText.setText(`剩余步数: ${this.moves}`)
                // 添加步数变化动画
                this.tweens.add({
                  targets: this.movesText,
                  scale: 1.2,
                  duration: 200,
                  yoyo: true,
                  repeat: 1
                })
                if (this.moves <= 0) {
                  this.gameOver()
                }
              } else {
                // 不同类型的方块，没有消除，交换回来
                this.swapBlocksBack(block1, block2)
              }
            }

            // 取消选择
            this.selectedBlock = null
            this.updateBlockSelection()
          }
        })
      }
    })
  }

  swapBlocksBack(block1, block2) {
    // 交换回来
    const x1 = block1.getData('x')
    const y1 = block1.getData('y')
    const x2 = block2.getData('x')
    const y2 = block2.getData('y')
    const type1 = block1.getData('type')
    const type2 = block2.getData('type')

    // 交换游戏板中的数据
    this.board[y1][x1] = type2
    this.board[y2][x2] = type1

    // 交换方块的位置
    const tempX = block1.x
    const tempY = block1.y

    this.tweens.add({
      targets: block1,
      x: block2.x,
      y: block2.y,
      duration: 200,
      onComplete: () => {
        this.tweens.add({
          targets: block2,
          x: tempX,
          y: tempY,
          duration: 200,
          onComplete: () => {
            // 更新方块的数据
            block1.setData('x', x2)
            block1.setData('y', y2)
            block1.setData('type', type2)
            block1.setTexture(`block${type2}`)

            block2.setData('x', x1)
            block2.setData('y', y1)
            block2.setData('type', type1)
            block2.setTexture(`block${type1}`)
          }
        })
      }
    })
  }

  checkMatches() {
    // 检查所有匹配
    const matches = []

    // 检查横向匹配
    for (let y = 0; y < this.boardHeight; y++) {
      let count = 1
      let startX = 0
      for (let x = 1; x < this.boardWidth; x++) {
        if (this.board[y][x] === this.board[y][x - 1]) {
          count++
        } else {
          if (count >= 3) {
            for (let i = startX; i < x; i++) {
              matches.push({ x: i, y: y })
            }
          }
          count = 1
          startX = x
        }
      }
      if (count >= 3) {
        for (let i = startX; i < this.boardWidth; i++) {
          matches.push({ x: i, y: y })
        }
      }
    }

    // 检查纵向匹配
    for (let x = 0; x < this.boardWidth; x++) {
      let count = 1
      let startY = 0
      for (let y = 1; y < this.boardHeight; y++) {
        if (this.board[y][x] === this.board[y - 1][x]) {
          count++
        } else {
          if (count >= 3) {
            for (let i = startY; i < y; i++) {
              matches.push({ x: x, y: i })
            }
          }
          count = 1
          startY = y
        }
      }
      if (count >= 3) {
        for (let i = startY; i < this.boardHeight; i++) {
          matches.push({ x: x, y: i })
        }
      }
    }

    return matches
  }

  removeMatches(matches) {
    // 移除匹配的方块
    for (const match of matches) {
      // 找到对应的方块
      for (let i = this.blocks.length - 1; i >= 0; i--) {
        const block = this.blocks[i]
        if (block.getData('x') === match.x && block.getData('y') === match.y) {
          // 添加消除动画
          this.tweens.add({
            targets: block,
            scale: 0,
            duration: 300,
            onComplete: () => {
              block.destroy()
            }
          })
          // 从数组中移除
          this.blocks.splice(i, 1)
          break
        }
      }
      // 清空游戏板中的数据
      this.board[match.y][match.x] = 0
    }

    // 更新分数
    this.score += matches.length * 10
    this.scoreText.setText(`分数: ${this.score}/${this.scoreTarget}`)
    // 添加分数变化动画
    this.tweens.add({
      targets: this.scoreText,
      scale: 1.2,
      duration: 200,
      yoyo: true,
      repeat: 1
    })
    
    // 检查是否达到分数目标
    if (this.score >= this.scoreTarget) {
      this.gameWin()
    }

    // 等待动画完成后，填充新方块
    this.time.delayedCall(300, () => {
      this.fillBlocks()
    })
  }

  fillBlocks() {
    // 填充新方块
    for (let x = 0; x < this.boardWidth; x++) {
      let emptySpaces = 0
      // 从下往上填充
      for (let y = this.boardHeight - 1; y >= 0; y--) {
        if (this.board[y][x] === 0) {
          emptySpaces++
        } else if (emptySpaces > 0) {
          // 下移方块
          this.board[y + emptySpaces][x] = this.board[y][x]
          this.board[y][x] = 0
          // 更新方块位置
          for (const block of this.blocks) {
            if (block.getData('x') === x && block.getData('y') === y) {
              block.setData('y', y + emptySpaces)
              this.tweens.add({
                targets: block,
                y: this.boardY + (y + emptySpaces) * this.blockSize + this.blockSize / 2,
                duration: 300
              })
              break
            }
          }
        }
      }
      // 顶部填充新方块
      for (let y = 0; y < emptySpaces; y++) {
        const blockType = Phaser.Math.Between(1, this.blockTypes)
        this.board[y][x] = blockType
        // 创建新方块
        const block = this.add.image(
          this.boardX + x * this.blockSize + this.blockSize / 2,
          this.boardY - (emptySpaces - y) * this.blockSize + this.blockSize / 2,
          `block${blockType}`
        )
        block.setDisplaySize(this.blockSize * 0.8, this.blockSize * 0.8)
        block.setData('x', x)
        block.setData('y', y)
        block.setData('type', blockType)
        block.setInteractive()
        this.blocks.push(block)

        // 添加下落动画
        this.tweens.add({
          targets: block,
          y: this.boardY + y * this.blockSize + this.blockSize / 2,
          duration: 300
        })
      }
    }

    // 等待动画完成后，检查是否有新的匹配
    this.time.delayedCall(300, () => {
      this.checkForNewMatches()
    })
  }

  checkForNewMatches() {
    // 检查是否有新的匹配
    const newMatches = this.checkMatches()
    if (newMatches.length > 0) {
      this.removeMatches(newMatches)
    }
  }

  updateBlockSelection() {
    // 更新方块的选择状态
    for (const block of this.blocks) {
      if (block === this.selectedBlock) {
        // 添加明显的高亮效果
        block.setTint(0xffff00)
        // 保持原始显示大小比例，只添加高亮效果
      } else {
        // 清除高亮效果
        block.clearTint()
      }
    }
  }

  gameOver() {
    // 游戏结束
    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, '游戏结束', {
      fontSize: '48px',
      fill: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 60, `最终分数: ${this.score}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 100, `目标分数: ${this.scoreTarget}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)

    // 添加重新开始按钮
    const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 160, '重新开始', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x3498db,
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5)
    restartButton.setInteractive()
    restartButton.on('pointerdown', () => {
      this.scene.restart()
    })

    // 添加返回按钮
    const backButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 220, '返回关卡选择', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0xe74c3c,
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5)
    backButton.setInteractive()
    backButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene')
    })
  }

  gameWin() {
    // 游戏胜利
    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, '游戏胜利！', {
      fontSize: '48px',
      fill: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 60, `最终分数: ${this.score}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 100, `目标分数: ${this.scoreTarget}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)

    // 添加重新开始按钮
    const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 160, '重新开始', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x3498db,
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5)
    restartButton.setInteractive()
    restartButton.on('pointerdown', () => {
      this.scene.restart()
    })

    // 添加返回按钮
    const backButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 220, '返回关卡选择', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0xe74c3c,
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5)
    backButton.setInteractive()
    backButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene')
    })
  }

  toggleMusic() {
    this.musicOn = !this.musicOn
    const backgroundMusic = this.sound.get('backgroundMusic')
    if (backgroundMusic) {
      if (this.musicOn) {
        backgroundMusic.play()
        this.musicButton.setTexture('musicOn')
      } else {
        backgroundMusic.pause()
        this.musicButton.setTexture('musicOff')
      }
    }
  }
}

// 设置场景
class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene')
    this.blockImage = 'cdd'
  }

  preload() {
    // 加载背景图片
    this.load.image('gameBg', 'image/background/game_bg.jpg')
    this.load.image('musicOn', 'image/music-on.png')
    this.load.image('musicOff', 'image/music-off.png')
  }

  create() {
    // 添加背景图片
    this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'gameBg')
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)
    
    // 添加半透明纯色背景覆盖层，突出显示界面元素
    this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x1a1a2e, 0.8).setOrigin(0, 0)

    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, 100, '游戏设置', {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    // 标题进入动画
    title.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 600,
      ease: 'Back.easeOut'
    })

    // 添加返回按钮
    const backButton = this.add.text(50, 50, '返回', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: 0x000000,
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    })
    backButton.setInteractive()
    backButton.on('pointerdown', () => {
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('LevelSelectScene')
      })
    })
    // 按钮悬停效果
    backButton.on('pointerover', () => {
      backButton.setBackgroundColor(0x333333)
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor(0x000000)
      this.tweens.add({
        targets: backButton,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    backButton.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: backButton,
      x: 50,
      alpha: 1,
      duration: 500,
      delay: 100,
      ease: 'Power2.easeOut'
    })

    // 添加音乐开关按钮
    this.backgroundMusic = this.sound.get('backgroundMusic')
    this.musicOn = this.backgroundMusic && this.backgroundMusic.isPlaying
    this.musicButton = this.add.image(this.sys.game.config.width - 50, 50, this.musicOn ? 'musicOn' : 'musicOff')
      .setInteractive()
      .setScale(0.5)
    this.musicButton.on('pointerdown', () => {
      this.toggleMusic()
      // 按钮点击动画
      this.tweens.add({
        targets: this.musicButton,
        scale: 0.4,
        duration: 100,
        yoyo: true,
        repeat: 1
      })
    })
    // 按钮进入动画
    this.musicButton.setX(this.sys.game.config.width + 100).setAlpha(0)
    this.tweens.add({
      targets: this.musicButton,
      x: this.sys.game.config.width - 50,
      alpha: 1,
      duration: 500,
      delay: 150,
      ease: 'Power2.easeOut'
    })

    // 添加方块图片选择
    const imageLabel = this.add.text(300, 200, '方块图片:', {
      fontSize: '20px',
      fill: '#ffffff'
    })
    // 标签进入动画
    imageLabel.setX(-100).setAlpha(0)
    this.tweens.add({
      targets: imageLabel,
      x: 300,
      alpha: 1,
      duration: 500,
      delay: 200,
      ease: 'Power2.easeOut'
    })

    // 方块图片选项
    const imageOptions = [
      { name: '默认图片', value: 'cdd' }
    ]

    let y = 250
    for (let i = 0; i < imageOptions.length; i++) {
      const option = imageOptions[i]
      const button = this.add.text(350, y, option.name, {
        fontSize: '18px',
        fill: '#ffffff',
        backgroundColor: this.blockImage === option.value ? 0x27ae60 : 0x34495e,
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
      })
      button.setInteractive()
      button.on('pointerdown', () => {
        this.blockImage = option.value
        // 重新创建按钮以更新选中状态
        this.scene.restart()
      })
      // 按钮悬停效果
      button.on('pointerover', () => {
        if (this.blockImage !== option.value) {
          button.setBackgroundColor(0x2c3e50)
          this.tweens.add({
            targets: button,
            scale: 1.05,
            duration: 100
          })
        }
      })
      button.on('pointerout', () => {
        if (this.blockImage !== option.value) {
          button.setBackgroundColor(0x34495e)
          this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100
          })
        }
      })
      // 按钮进入动画
      button.setX(-100).setAlpha(0)
      this.tweens.add({
        targets: button,
        x: 350,
        alpha: 1,
        duration: 500,
        delay: 250 + i * 100,
        ease: 'Power2.easeOut'
      })
      y += 50
    }

    // 添加确认按钮
    const confirmButton = this.add.text(this.sys.game.config.width / 2, 450, '确认', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x27ae60,
      padding: { left: 30, right: 30, top: 15, bottom: 15 }
    }).setOrigin(0.5)
    confirmButton.setInteractive()
    confirmButton.on('pointerdown', () => {
      // 保存设置
      localStorage.setItem('blockImage', this.blockImage)
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('LevelSelectScene')
      })
    })
    // 按钮悬停效果
    confirmButton.on('pointerover', () => {
      confirmButton.setBackgroundColor(0x229954)
      this.tweens.add({
        targets: confirmButton,
        scale: 1.05,
        duration: 100
      })
    })
    confirmButton.on('pointerout', () => {
      confirmButton.setBackgroundColor(0x27ae60)
      this.tweens.add({
        targets: confirmButton,
        scale: 1,
        duration: 100
      })
    })
    // 按钮进入动画
    confirmButton.setY(600).setAlpha(0)
    this.tweens.add({
      targets: confirmButton,
      y: 450,
      alpha: 1,
      duration: 600,
      delay: 400,
      ease: 'Bounce.easeOut'
    })
    
    // 场景进入动画
    this.cameras.main.fadeIn(500)
  }

  toggleMusic() {
    this.musicOn = !this.musicOn
    const backgroundMusic = this.sound.get('backgroundMusic')
    if (backgroundMusic) {
      if (this.musicOn) {
        backgroundMusic.play()
        this.musicButton.setTexture('musicOn')
      } else {
        backgroundMusic.pause()
        this.musicButton.setTexture('musicOff')
      }
    }
  }
}

// 游戏配置
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: [LoginScene, LevelSelectScene, CustomLevelScene, GameScene, SettingsScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
    transparent: false,
    clearBeforeRender: true
  },
  audio: {
    disableAudio: false,
    noAudio: false
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  }
}

// 创建游戏实例
const game = new Phaser.Game(config)