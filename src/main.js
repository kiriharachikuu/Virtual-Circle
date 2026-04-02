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
    
    // 加载公告相关图片
    this.load.image('noticeButton', 'image/notice.png')
    this.load.image('closeButton', 'image/off.png')
    
    // 加载背景音乐
    this.load.audio('backgroundMusic', 'desktop.mp3')
  }

  create() {
    // 添加背景图片
    this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'loginBg')
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)

    // 定义左侧边距常量，确保logo和版本号对齐
    const leftMargin = 90

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
    this.add.text(leftMargin, this.sys.game.config.height - 50, '整活版本, 不代表最终品质', {
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
    
    // 添加公告按钮
    this.noticeButton = this.add.image(this.sys.game.config.width - 120, 50, 'noticeButton')
      .setInteractive()
      .setScale(0.5)
    this.noticeButton.on('pointerdown', () => {
      this.showNotice()
    })
  }

  showNotice() {
    // 检查是否有缓存的公告数据
    if (!this.noticeData) {
      // 从JSON文件获取公告内容
      fetch('public/notice.json')
        .then(response => response.json())
        .then(data => {
          this.noticeData = data
          this.renderNoticePanel(data)
        })
        .catch(error => {
          console.error('Failed to load notice data:', error)
          this.renderNoticePanel({ content: '公告加载失败，请稍后再试！' })
        })
    } else {
      // 使用缓存的公告数据
      this.renderNoticePanel(this.noticeData)
    }
  }

  renderNoticePanel(noticeData) {
    // 创建公告面板
    const panelWidth = Math.min(600, this.sys.game.config.width * 0.8)
    const panelHeight = Math.min(500, this.sys.game.config.height * 0.7)
    const panelX = (this.sys.game.config.width - panelWidth) / 2
    const panelY = (this.sys.game.config.height - panelHeight) / 2
    
    // 创建半透明背景
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height)
    
    // 创建公告面板背景
    const panelBg = this.add.graphics()
    panelBg.fillStyle(0x1a1a2e, 0.9)
    panelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 20)
    
    // 添加边框
    const panelBorder = this.add.graphics()
    panelBorder.lineStyle(3, 0x3498db, 1)
    panelBorder.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 20)
    
    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, panelY + 30, '游戏公告', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#3498db',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    // 获取公告列表
    const notices = noticeData.notices || []
    let currentNoticeIndex = 0
    
    // 添加公告内容区域
    const contentY = panelY + 80
    const contentWidth = panelWidth - 60
    const contentHeight = panelHeight - 180
    
    // 创建公告内容容器
    const contentContainer = this.add.container(this.sys.game.config.width / 2, contentY)
    
    // 创建公告元素数组
    const noticeElements = []
    
    notices.forEach((notice, index) => {
      const noticeGroup = this.add.container(0, 0)
      
      // 添加公告标题
      const noticeTitle = this.add.text(0, 0, notice.title, {
        fontSize: '18px',
        fill: '#3498db',
        fontStyle: 'bold',
        wordWrap: {
          width: contentWidth,
          useAdvancedWrap: true
        }
      }).setOrigin(0.5)
      noticeGroup.add(noticeTitle)
      
      // 添加发布时间
      const noticeDate = this.add.text(0, 25, notice.date, {
        fontSize: '14px',
        fill: '#95a5a6',
        wordWrap: {
          width: contentWidth,
          useAdvancedWrap: true
        }
      }).setOrigin(0.5)
      noticeGroup.add(noticeDate)
      
      // 添加内容
      const noticeContent = this.add.text(0, 100, notice.content, {
        fontSize: '16px',
        fill: '#ffffff',
        lineSpacing: 10,
        wordWrap: {
          width: contentWidth,
          useAdvancedWrap: true
        }
      }).setOrigin(0.5)
      noticeGroup.add(noticeContent)
      
      // 初始隐藏所有公告
      noticeGroup.setAlpha(0)
      noticeElements.push(noticeGroup)
      contentContainer.add(noticeGroup)
    })
    
    // 显示当前公告
    if (noticeElements.length > 0) {
      this.tweens.add({
        targets: noticeElements[currentNoticeIndex],
        alpha: 1,
        duration: 500
      })
    }
    
    // 添加导航按钮
    let prevButton, nextButton
    if (notices.length > 1) {
      // 上一页按钮
      prevButton = this.add.text(panelX + 30, panelY + panelHeight - 40, '上一页', {
        fontSize: '14px',
        fill: '#ffffff',
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        padding: { left: 15, right: 15, top: 5, bottom: 5 },
        borderRadius: 15
      }).setInteractive()
      
      prevButton.on('pointerdown', () => {
        this.switchNotice(-1)
      })
      
      // 下一页按钮
      nextButton = this.add.text(panelX + panelWidth - 90, panelY + panelHeight - 40, '下一页', {
        fontSize: '14px',
        fill: '#ffffff',
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        padding: { left: 15, right: 15, top: 5, bottom: 5 },
        borderRadius: 15
      }).setInteractive()
      
      nextButton.on('pointerdown', () => {
        this.switchNotice(1)
      })
      
      // 按钮悬停效果
      prevButton.on('pointerover', () => {
        prevButton.setBackgroundColor('rgba(41, 128, 185, 1)')
      })
      prevButton.on('pointerout', () => {
        prevButton.setBackgroundColor('rgba(52, 152, 219, 0.8)')
      })
      
      nextButton.on('pointerover', () => {
        nextButton.setBackgroundColor('rgba(41, 128, 185, 1)')
      })
      nextButton.on('pointerout', () => {
        nextButton.setBackgroundColor('rgba(52, 152, 219, 0.8)')
      })
    }
    
    // 添加关闭按钮
    const closeButton = this.add.image(panelX + panelWidth - 30, panelY + 30, 'closeButton')
      .setInteractive()
      .setScale(0.5)
    closeButton.on('pointerdown', () => {
      overlay.destroy()
      panelBg.destroy()
      panelBorder.destroy()
      title.destroy()
      contentContainer.destroy()
      if (prevButton) prevButton.destroy()
      if (nextButton) nextButton.destroy()
      closeButton.destroy()
    })
    
    // 进入动画
    overlay.setAlpha(0)
    panelBg.setAlpha(0)
    panelBorder.setAlpha(0)
    title.setScale(0).setAlpha(0)
    contentContainer.setAlpha(0)
    if (prevButton) prevButton.setAlpha(0)
    if (nextButton) nextButton.setAlpha(0)
    closeButton.setScale(0).setAlpha(0)
    
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 300,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: panelBg,
      alpha: 1,
      duration: 300,
      delay: 100,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: panelBorder,
      alpha: 1,
      duration: 300,
      delay: 150,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 200,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: contentContainer,
      alpha: 1,
      duration: 500,
      delay: 250,
      ease: 'Power2.easeOut'
    })
    
    if (prevButton && nextButton) {
      this.tweens.add({
        targets: [prevButton, nextButton],
        alpha: 1,
        duration: 500,
        delay: 300,
        ease: 'Power2.easeOut'
      })
    }
    
    this.tweens.add({
      targets: closeButton,
      scale: 0.5,
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: 'Bounce.easeOut'
    })
    
    // 保存公告相关引用
    this.currentNoticeIndex = currentNoticeIndex
    this.noticeElements = noticeElements
    this.notices = notices
  }
  
  switchNotice(direction) {
    if (!this.noticeElements || this.noticeElements.length <= 1) return
    
    // 隐藏当前公告
    this.tweens.add({
      targets: this.noticeElements[this.currentNoticeIndex],
      alpha: 0,
      x: direction > 0 ? -20 : 20,
      duration: 300,
      ease: 'Power2.easeInOut'
    })
    
    // 计算下一个公告索引
    this.currentNoticeIndex = (this.currentNoticeIndex + direction + this.notices.length) % this.notices.length
    
    // 显示下一个公告
    const nextNotice = this.noticeElements[this.currentNoticeIndex]
    nextNotice.setX(direction > 0 ? 20 : -20)
    nextNotice.setAlpha(0)
    
    this.tweens.add({
      targets: nextNotice,
      alpha: 1,
      x: 0,
      duration: 300,
      ease: 'Power2.easeInOut'
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

  resize() {
    // 处理窗口大小变化
    if (this.musicButton) {
      this.musicButton.setPosition(this.sys.game.config.width - 50, 50)
    }
  }
}

// 添加全局resize事件监听
window.addEventListener('resize', () => {
  if (game && game.scene && game.scene.scenes) {
    game.scene.scenes.forEach(scene => {
      if (scene.resize) {
        scene.resize()
      }
    })
  }
})

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
    
    // 添加渐变背景覆盖层，增强视觉层次感
    const gradient = this.add.graphics()
    gradient.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x1a1a2e, 1)
    gradient.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height)
    gradient.setAlpha(0.8)

    // 添加装饰性网格背景
    const grid = this.add.graphics()
    grid.lineStyle(1, 0x3498db, 0.2)
    const gridSize = 50
    for (let x = 0; x < this.sys.game.config.width; x += gridSize) {
      grid.lineBetween(x, 0, x, this.sys.game.config.height)
    }
    for (let y = 0; y < this.sys.game.config.height; y += gridSize) {
      grid.lineBetween(0, y, this.sys.game.config.width, y)
    }

    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, 100, '选择关卡', {
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#3498db',
      strokeThickness: 2
    }).setOrigin(0.5)
    // 标题进入动画
    title.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 800,
      ease: 'Back.easeOut'
    })

    // 添加标题下方的装饰线
    const titleLine = this.add.graphics()
    titleLine.lineStyle(3, 0x3498db, 1)
    titleLine.lineBetween(this.sys.game.config.width / 2 - 100, 140, this.sys.game.config.width / 2 + 100, 140)
    titleLine.setAlpha(0)
    this.tweens.add({
      targets: titleLine,
      alpha: 1,
      duration: 600,
      delay: 400,
      ease: 'Power2.easeOut'
    })

    // 添加返回按钮
    const backButton = this.add.text(50, 50, '返回', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: 'rgba(52, 152, 219, 0.8)',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      borderRadius: 20
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
      backButton.setBackgroundColor('rgba(41, 128, 185, 1)')
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor('rgba(52, 152, 219, 0.8)')
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

    // 关卡配置参数
    const levelConfigs = [
      { id: 1, color: 0x3498db, name: '关卡 1', boardSize: 6, score: 1000, moves: 0, time: 0 },
      { id: 2, color: 0x27ae60, name: '关卡 2', boardSize: 8, score: 2500, moves: 15, time: 100 },
      { id: 3, color: 0xe67e22, name: '关卡 3', boardSize: 20, score: 5000, moves: 50, time: 100 }
    ]

    // 响应式布局计算
    const containerWidth = this.sys.game.config.width
    const containerHeight = this.sys.game.config.height
    const buttonWidth = Math.min(280, containerWidth * 0.35)
    const buttonHeight = 70
    const buttonGap = 25
    const totalButtonsHeight = (buttonHeight * 3) + (buttonGap * 2)
    const startY = Math.max(220, (containerHeight - totalButtonsHeight) / 2 + 50)

    // 添加关卡按钮
    const levelButtons = []
    for (let i = 0; i < levelConfigs.length; i++) {
      const config = levelConfigs[i]
      
      // 创建按钮背景
      const buttonBg = this.add.graphics()
      buttonBg.fillStyle(config.color, 0.8)
      buttonBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 15)
      
      const button = this.add.container(containerWidth / 2, startY + i * (buttonHeight + buttonGap), [buttonBg])
      
      // 添加按钮文本 - 关卡名称
      const buttonText = this.add.text(0, -10, config.name, {
        fontSize: '22px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5)
      button.add(buttonText)
      
      // 添加按钮描述
      let descText = `${config.boardSize}×${config.boardSize} | 目标: ${config.score}`
      if (config.moves > 0) descText += ` | ${config.moves}步`
      if (config.time > 0) descText += ` | ${config.time}秒`
      
      const descLabel = this.add.text(0, 12, descText, {
        fontSize: '13px',
        fill: 'rgba(255,255,255,0.8)',
        wordWrap: {
          width: buttonWidth - 40,
          useAdvancedWrap: true
        }
      }).setOrigin(0.5)
      button.add(descLabel)
      
      // 设置按钮交互区域 - 与背景完全对齐
      button.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
      button.on('pointerdown', () => {
        this.cameras.main.fadeOut(300)
        this.time.delayedCall(300, () => {
          this.scene.start('GameScene', { 
            level: config.id, 
            scoreTarget: config.score, 
            moves: config.moves, 
            time: config.time,
            boardSize: config.boardSize
          })
        })
      })
      // 按钮悬停效果
      button.on('pointerover', () => {
        buttonBg.fillStyle(config.color, 1)
        this.tweens.add({
          targets: button,
          scale: 1.05,
          duration: 100
        })
      })
      button.on('pointerout', () => {
        buttonBg.fillStyle(config.color, 0.8)
        this.tweens.add({
          targets: button,
          scale: 1,
          duration: 100
        })
      })
      // 按钮进入动画
      button.setScale(0).setAlpha(0)
      this.tweens.add({
        targets: button,
        scale: 1,
        alpha: 1,
        duration: 500,
        delay: 200 + i * 100,
        ease: 'Bounce.easeOut'
      })
      levelButtons.push(button)
    }

    // 添加自定义关卡按钮
    const customButtonBg = this.add.graphics()
    customButtonBg.fillStyle(0x9b59b6, 0.8)
    customButtonBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 15)
    
    const customButtonY = startY + 3 * (buttonHeight + buttonGap) + 20
    const customButton = this.add.container(containerWidth / 2, customButtonY, [customButtonBg])
    
    const customButtonText = this.add.text(0, 0, '自定义关卡', {
      fontSize: '22px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    customButton.add(customButtonText)
    
    customButton.setInteractive(new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
    customButton.on('pointerdown', () => {
      // 场景退出动画
      this.cameras.main.fadeOut(300)
      this.time.delayedCall(300, () => {
        this.scene.start('CustomLevelScene')
      })
    })
    // 按钮悬停效果
    customButton.on('pointerover', () => {
      customButtonBg.fillStyle(0x8e44ad, 1)
      this.tweens.add({
        targets: customButton,
        scale: 1.05,
        duration: 100
      })
    })
    customButton.on('pointerout', () => {
      customButtonBg.fillStyle(0x9b59b6, 0.8)
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
    
    // 添加粒子效果
    this.addParticles()
    
    // 场景进入动画
    this.cameras.main.fadeIn(500)
  }

  addParticles() {
    // 创建粒子系统
    const particles = this.add.particles('logo')
    
    const emitter = particles.createEmitter({
      x: { min: 0, max: this.sys.game.config.width },
      y: -50,
      lifespan: 2000,
      speed: { min: 100, max: 200 },
      gravity: 200,
      scale: { start: 0.1, end: 0.05 },
      alpha: { start: 0.5, end: 0 },
      frequency: 1000,
      maxParticles: 10
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
    this.load.image('gameBg', 'image/background/game_bg.png')
    this.load.image('musicOn', 'image/music-on.png')
    this.load.image('musicOff', 'image/music-off.png')
  }

  create() {
    // 添加背景图片
    this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'gameBg')
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)
    
    // 添加渐变背景覆盖层，增强视觉层次感
    const gradient = this.add.graphics()
    gradient.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x1a1a2e, 1)
    gradient.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height)
    gradient.setAlpha(0.8)

    // 添加装饰性网格背景
    const grid = this.add.graphics()
    grid.lineStyle(1, 0x9b59b6, 0.2)
    const gridSize = 50
    for (let x = 0; x < this.sys.game.config.width; x += gridSize) {
      grid.lineBetween(x, 0, x, this.sys.game.config.height)
    }
    for (let y = 0; y < this.sys.game.config.height; y += gridSize) {
      grid.lineBetween(0, y, this.sys.game.config.width, y)
    }

    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, 100, '自定义关卡', {
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#9b59b6',
      strokeThickness: 2
    }).setOrigin(0.5)
    // 标题进入动画
    title.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 800,
      ease: 'Back.easeOut'
    })

    // 添加标题下方的装饰线
    const titleLine = this.add.graphics()
    titleLine.lineStyle(3, 0x9b59b6, 1)
    titleLine.lineBetween(this.sys.game.config.width / 2 - 100, 140, this.sys.game.config.width / 2 + 100, 140)
    titleLine.setAlpha(0)
    this.tweens.add({
      targets: titleLine,
      alpha: 1,
      duration: 600,
      delay: 400,
      ease: 'Power2.easeOut'
    })

    // 添加返回按钮
    const backButton = this.add.text(50, 50, '返回', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: 'rgba(52, 152, 219, 0.8)',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      borderRadius: 20
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
      backButton.setBackgroundColor('rgba(41, 128, 185, 1)')
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor('rgba(52, 152, 219, 0.8)')
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

    // 创建参数设置区域
    const settingsContainer = this.add.container(this.sys.game.config.width / 2, 250)
    
    // 添加游戏板宽度设置
    this.createSettingRow(settingsContainer, 0, '游戏板宽度:', this.boardWidth, 5, 10, (value) => {
      this.boardWidth = value
      this.widthText.setText(value)
    })
    
    // 添加游戏板高度设置
    this.createSettingRow(settingsContainer, 80, '游戏板高度:', this.boardHeight, 5, 10, (value) => {
      this.boardHeight = value
      this.heightText.setText(value)
    })
    
    // 添加剩余步数设置
    this.createSettingRow(settingsContainer, 160, '剩余步数:', this.moves, 10, 100, (value) => {
      this.moves = value
      this.movesText.setText(value)
    }, 5)
    
    // 添加方块类型设置
    this.createSettingRow(settingsContainer, 240, '方块类型:', this.blockTypes, 3, 8, (value) => {
      this.blockTypes = value
      this.typesText.setText(value)
    })

    // 添加开始游戏按钮
    const startButtonBg = this.add.graphics()
    startButtonBg.fillStyle(0x27ae60, 0.8)
    startButtonBg.fillRoundedRect(0, 0, 240, 60, 20)
    
    const startButton = this.add.container(this.sys.game.config.width / 2, 500, [startButtonBg])
    
    const startButtonText = this.add.text(0, 0, '开始游戏', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    startButton.add(startButtonText)
    
    startButton.setInteractive(new Phaser.Geom.Rectangle(-120, -30, 240, 60), Phaser.Geom.Rectangle.Contains)
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
      startButtonBg.fillStyle(0x229954, 1)
      this.tweens.add({
        targets: startButton,
        scale: 1.05,
        duration: 100
      })
    })
    startButton.on('pointerout', () => {
      startButtonBg.fillStyle(0x27ae60, 0.8)
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
      y: 500,
      alpha: 1,
      duration: 600,
      delay: 1000,
      ease: 'Bounce.easeOut'
    })
    
    // 添加粒子效果
    this.addParticles()
    
    // 场景进入动画
    this.cameras.main.fadeIn(500)
  }

  createSettingRow(container, y, label, value, min, max, onValueChange, step = 1) {
    // 创建标签
    const labelText = this.add.text(-200, y, label, {
      fontSize: '20px',
      fill: '#ffffff'
    })
    container.add(labelText)
    
    // 创建减号按钮
    const minusBg = this.add.graphics()
    minusBg.fillStyle(0x34495e, 0.8)
    minusBg.fillRoundedRect(0, 0, 40, 40, 10)
    
    const minusButton = this.add.container(-50, y, [minusBg])
    const minusText = this.add.text(0, 0, '-', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    minusButton.add(minusText)
    
    minusButton.setInteractive(new Phaser.Geom.Rectangle(-20, -20, 40, 40), Phaser.Geom.Rectangle.Contains)
    minusButton.on('pointerdown', () => {
      if (value > min) {
        value -= step
        onValueChange(value)
        // 数值变化动画
        this.tweens.add({
          targets: valueText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    
    // 按钮悬停效果
    minusButton.on('pointerover', () => {
      minusBg.fillStyle(0x2c3e50, 1)
      this.tweens.add({
        targets: minusButton,
        scale: 1.05,
        duration: 100
      })
    })
    minusButton.on('pointerout', () => {
      minusBg.fillStyle(0x34495e, 0.8)
      this.tweens.add({
        targets: minusButton,
        scale: 1,
        duration: 100
      })
    })
    container.add(minusButton)
    
    // 创建数值显示
    const valueText = this.add.text(0, y, value, {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    container.add(valueText)
    
    // 保存引用
    if (label.includes('宽度')) this.widthText = valueText
    if (label.includes('高度')) this.heightText = valueText
    if (label.includes('步数')) this.movesText = valueText
    if (label.includes('类型')) this.typesText = valueText
    
    // 创建加号按钮
    const plusBg = this.add.graphics()
    plusBg.fillStyle(0x34495e, 0.8)
    plusBg.fillRoundedRect(0, 0, 40, 40, 10)
    
    const plusButton = this.add.container(50, y, [plusBg])
    const plusText = this.add.text(0, 0, '+', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    plusButton.add(plusText)
    
    plusButton.setInteractive(new Phaser.Geom.Rectangle(-20, -20, 40, 40), Phaser.Geom.Rectangle.Contains)
    plusButton.on('pointerdown', () => {
      if (value < max) {
        value += step
        onValueChange(value)
        // 数值变化动画
        this.tweens.add({
          targets: valueText,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          repeat: 1
        })
      }
    })
    
    // 按钮悬停效果
    plusButton.on('pointerover', () => {
      plusBg.fillStyle(0x2c3e50, 1)
      this.tweens.add({
        targets: plusButton,
        scale: 1.05,
        duration: 100
      })
    })
    plusButton.on('pointerout', () => {
      plusBg.fillStyle(0x34495e, 0.8)
      this.tweens.add({
        targets: plusButton,
        scale: 1,
        duration: 100
      })
    })
    container.add(plusButton)
    
    // 添加进度条
    const progressBg = this.add.graphics()
    progressBg.fillStyle(0x2c3e50, 0.3)
    progressBg.fillRoundedRect(0, 0, 100, 8, 4)
    
    const progressFill = this.add.graphics()
    const progressWidth = 100 * (value - min) / (max - min)
    progressFill.fillStyle(0x9b59b6, 0.8)
    progressFill.fillRoundedRect(0, 0, progressWidth, 8, 4)
    
    const progressBar = this.add.container(0, y + 30, [progressBg, progressFill])
    container.add(progressBar)
    
    // 进入动画
    labelText.setX(-300).setAlpha(0)
    minusButton.setX(-150).setAlpha(0)
    valueText.setScale(0).setAlpha(0)
    plusButton.setX(150).setAlpha(0)
    progressBar.setY(y + 50).setAlpha(0)
    
    this.tweens.add({
      targets: labelText,
      x: -200,
      alpha: 1,
      duration: 500,
      delay: 200 + y * 0.5,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: minusButton,
      x: -50,
      alpha: 1,
      duration: 500,
      delay: 250 + y * 0.5,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: valueText,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 300 + y * 0.5,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: plusButton,
      x: 50,
      alpha: 1,
      duration: 500,
      delay: 350 + y * 0.5,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: progressBar,
      y: y + 30,
      alpha: 1,
      duration: 500,
      delay: 400 + y * 0.5,
      ease: 'Power2.easeOut'
    })
  }

  addParticles() {
    // 创建粒子系统
    const particles = this.add.particles('logo')
    
    const emitter = particles.createEmitter({
      x: { min: 0, max: this.sys.game.config.width },
      y: -50,
      lifespan: 2000,
      speed: { min: 100, max: 200 },
      gravity: 200,
      scale: { start: 0.1, end: 0.05 },
      alpha: { start: 0.5, end: 0 },
      frequency: 1500,
      maxParticles: 8
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
    this.blockTypes = 6
    this.blockImages = ['nana7mi', 'shizukululu', 'taffy', 'xingtong', 'lovely', 'tiandou']
    // combo相关属性
    this.comboCount = 0
    this.comboThreshold = 3 // 连续消除3次触发combo
    this.maxCombo = 0
    this.comboText = null
  }

  preload() {
    // 加载背景图片
    this.load.image('gameBg', 'image/background/game_bg.png')
    
    // 加载所有方块图片（后续会根据关卡限制使用）
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
    
    // 添加渐变背景覆盖层，增强视觉层次感
    const gradient = this.add.graphics()
    gradient.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x1a1a2e, 1)
    gradient.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height)
    gradient.setAlpha(0.7)

    // 添加装饰性网格背景
    const grid = this.add.graphics()
    grid.lineStyle(1, 0x3498db, 0.2)
    const gridSize = 50
    for (let x = 0; x < this.sys.game.config.width; x += gridSize) {
      grid.lineBetween(x, 0, x, this.sys.game.config.height)
    }
    for (let y = 0; y < this.sys.game.config.height; y += gridSize) {
      grid.lineBetween(0, y, this.sys.game.config.width, y)
    }

    // 保存关卡信息
    this.level = data.level || 0
    
    // 检查是否有自定义参数或关卡配置
    if (data.custom) {
      this.boardWidth = data.boardWidth || 8
      this.boardHeight = data.boardHeight || 8
      this.moves = data.moves || 30
      this.blockTypes = data.blockTypes || 6
      this.scoreTarget = this.boardWidth * this.boardHeight * this.blockTypes * 5
      this.timeLimit = 0 // 自定义关卡默认无时间限制
    } else {
      // 使用关卡配置参数
      this.boardWidth = data.boardSize || 8
      this.boardHeight = data.boardSize || 8
      this.scoreTarget = data.scoreTarget || (this.boardWidth * this.boardHeight * this.blockTypes * 5)
      this.moves = data.moves !== undefined ? data.moves : 30
      this.timeLimit = data.time || 0 // 从数据中获取时间限制
      
      // 第一关限制方块类型为4种
      if (this.level === 1) {
        this.blockTypes = 4
      }
    }
    
    // 初始化当前关卡分数（每个关卡独立计算）
    this.score = 0

    // 计算棋盘自适应缩放
    const containerWidth = this.sys.game.config.width
    const containerHeight = this.sys.game.config.height
    const infoPanelWidth = Math.min(280, containerWidth * 0.25)
    const sideMargin = 20
    const topMargin = 100
    const bottomMargin = 20
    
    // 计算可用空间
    const availableWidth = containerWidth - infoPanelWidth - sideMargin * 2
    const availableHeight = containerHeight - topMargin - bottomMargin
    
    // 计算方块大小，使棋盘自适应
    const maxBlockSizeByWidth = availableWidth / this.boardWidth
    const maxBlockSizeByHeight = availableHeight / this.boardHeight
    this.blockSize = Math.floor(Math.min(maxBlockSizeByWidth, maxBlockSizeByHeight))
    this.blockSize = Math.max(15, Math.min(80, this.blockSize)) // 限制在15-80之间，更小的最小值以适应大棋盘
    
    // 重新计算棋盘位置
    this.boardX = infoPanelWidth + sideMargin + (availableWidth - this.boardWidth * this.blockSize) / 2
    this.boardY = topMargin + (availableHeight - this.boardHeight * this.blockSize) / 2
    
    // 确保棋盘位置不会超出屏幕
    this.boardX = Math.max(0, this.boardX)
    this.boardY = Math.max(0, this.boardY)

    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, 50, data.custom ? `自定义关卡` : `关卡 ${data.level}`, {
      fontSize: '32px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#3498db',
      strokeThickness: 2
    }).setOrigin(0.5)
    // 标题进入动画
    title.setScale(0).setAlpha(0)
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 800,
      ease: 'Back.easeOut'
    })

    // 添加返回按钮
    const backButton = this.add.text(50, 50, '返回', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: 'rgba(52, 152, 219, 0.8)',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      borderRadius: 20
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
      backButton.setBackgroundColor('rgba(41, 128, 185, 1)')
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButton.setBackgroundColor('rgba(52, 152, 219, 0.8)')
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

    // 创建游戏信息面板
    this.createGameInfoPanel()

    // 创建游戏板背景
    this.createBoardBackground()

    // 初始化游戏板
    this.initBoard()

    // 生成方块
    this.generateBlocks()

    // 监听鼠标点击
    this.input.on('pointerdown', this.onPointerDown, this)
    
    // 启动倒计时（如果有时间限制）
    if (this.timeLimit > 0) {
      this.currentTime = this.timeLimit
      this.timeEvent = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer, 
        callbackScope: this,
        repeat: this.timeLimit - 1
      })
    }
    
    // 添加粒子效果
    this.addParticles()
    
    // 场景进入动画
    this.cameras.main.fadeIn(500)
  }

  createGameInfoPanel() {
    // 响应式布局 - 信息面板放在左侧
    const panelWidth = Math.min(280, this.sys.game.config.width * 0.25)
    const panelHeight = Math.min(220, this.sys.game.config.height * 0.4)
    const panelX = 30
    const panelY = 100

    // 创建信息面板背景
    const panelBg = this.add.graphics()
    panelBg.fillStyle(0x1a1a2e, 0.8)
    panelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15)
    
    const padding = 20
    const lineHeight = 32
    
    // 添加分数显示
    const scoreLabel = this.add.text(panelX + padding, panelY + padding, '分数:', {
      fontSize: '16px',
      fill: '#ffffff'
    })
    
    this.scoreText = this.add.text(panelX + panelWidth - padding - 80, panelY + padding, `${this.score}/${this.scoreTarget}`, {
      fontSize: '16px',
      fill: '#4CAF50',
      fontStyle: 'bold',
      wordWrap: {
        width: 80,
        useAdvancedWrap: true
      }
    })
    
    // 添加分数进度条
    const progressWidth = panelWidth - padding * 2
    const progressY = panelY + padding + lineHeight
    const scoreProgressBg = this.add.graphics()
    scoreProgressBg.fillStyle(0x2c3e50, 0.5)
    scoreProgressBg.fillRoundedRect(panelX + padding, progressY, progressWidth, 8, 4)
    
    this.scoreProgressFill = this.add.graphics()
    const fillWidth = progressWidth * Math.min(this.score / this.scoreTarget, 1)
    this.scoreProgressFill.fillStyle(0x4CAF50, 0.8)
    this.scoreProgressFill.fillRoundedRect(panelX + padding, progressY, fillWidth, 8, 4)
    
    // 添加剩余步数显示
    const movesY = progressY + 25
    const movesLabel = this.add.text(panelX + padding, movesY, '剩余步数:', {
      fontSize: '16px',
      fill: '#ffffff'
    })
    
    const movesText = this.moves > 0 ? `${this.moves}` : '无限制'
    this.movesText = this.add.text(panelX + panelWidth - padding - 50, movesY, movesText, {
      fontSize: '16px',
      fill: this.moves > 0 ? '#3498db' : '#27ae60',
      fontStyle: 'bold'
    })
    
    // 添加目标分数显示
    const targetY = movesY + lineHeight
    const targetLabel = this.add.text(panelX + padding, targetY, '目标分数:', {
      fontSize: '16px',
      fill: '#ffffff'
    })
    
    this.scoreTargetText = this.add.text(panelX + panelWidth - padding - 60, targetY, `${this.scoreTarget}`, {
      fontSize: '16px',
      fill: '#9b59b6',
      fontStyle: 'bold'
    })
    
    // 添加时间显示（如果有时间限制）
    if (this.timeLimit > 0) {
      const timeY = targetY + lineHeight
      const timeLabel = this.add.text(panelX + padding, timeY, '剩余时间:', {
        fontSize: '16px',
        fill: '#ffffff'
      })
      
      this.timeText = this.add.text(panelX + panelWidth - padding - 50, timeY, `${this.timeLimit}`, {
        fontSize: '16px',
        fill: '#e74c3c',
        fontStyle: 'bold'
      })
    }
    
    // 进入动画
    panelBg.setAlpha(0)
    scoreLabel.setX(-100).setAlpha(0)
    this.scoreText.setX(-100).setAlpha(0)
    scoreProgressBg.setAlpha(0)
    this.scoreProgressFill.setAlpha(0)
    movesLabel.setX(-100).setAlpha(0)
    this.movesText.setX(-100).setAlpha(0)
    targetLabel.setX(-100).setAlpha(0)
    this.scoreTargetText.setX(-100).setAlpha(0)
    
    this.tweens.add({
      targets: panelBg,
      alpha: 1,
      duration: 500,
      delay: 200,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: scoreLabel,
      x: panelX + padding,
      alpha: 1,
      duration: 500,
      delay: 250,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: this.scoreText,
      x: panelX + panelWidth - padding - 80,
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: [scoreProgressBg, this.scoreProgressFill],
      alpha: 1,
      duration: 500,
      delay: 350,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: movesLabel,
      x: panelX + padding,
      alpha: 1,
      duration: 500,
      delay: 400,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: this.movesText,
      x: panelX + panelWidth - padding - 50,
      alpha: 1,
      duration: 500,
      delay: 450,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: targetLabel,
      x: panelX + padding,
      alpha: 1,
      duration: 500,
      delay: 500,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: this.scoreTargetText,
      x: panelX + panelWidth - padding - 60,
      alpha: 1,
      duration: 500,
      delay: 550,
      ease: 'Power2.easeOut'
    })
  }

  createBoardBackground() {
    // 创建游戏板背景 - 响应式尺寸
    const boardPadding = 15
    const boardBg = this.add.graphics()
    boardBg.fillStyle(0x1a1a2e, 0.8)
    boardBg.fillRoundedRect(
      this.boardX - boardPadding, 
      this.boardY - boardPadding, 
      this.boardWidth * this.blockSize + boardPadding * 2, 
      this.boardHeight * this.blockSize + boardPadding * 2, 
      15
    )
    
    // 添加游戏板边框
    const boardBorder = this.add.graphics()
    boardBorder.lineStyle(2, 0x3498db, 0.8)
    boardBorder.strokeRoundedRect(
      this.boardX - boardPadding, 
      this.boardY - boardPadding, 
      this.boardWidth * this.blockSize + boardPadding * 2, 
      this.boardHeight * this.blockSize + boardPadding * 2, 
      15
    )
    
    // 添加网格线
    const grid = this.add.graphics()
    grid.lineStyle(1, 0x34495e, 0.5)
    for (let x = 0; x <= this.boardWidth; x++) {
      grid.lineBetween(
        this.boardX + x * this.blockSize, 
        this.boardY, 
        this.boardX + x * this.blockSize, 
        this.boardY + this.boardHeight * this.blockSize
      )
    }
    for (let y = 0; y <= this.boardHeight; y++) {
      grid.lineBetween(
        this.boardX, 
        this.boardY + y * this.blockSize, 
        this.boardX + this.boardWidth * this.blockSize, 
        this.boardY + y * this.blockSize
      )
    }
    
    // 进入动画
    boardBg.setAlpha(0)
    boardBorder.setAlpha(0)
    grid.setAlpha(0)
    
    this.tweens.add({
      targets: boardBg,
      alpha: 1,
      duration: 500,
      delay: 600,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: boardBorder,
      alpha: 1,
      duration: 500,
      delay: 650,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: grid,
      alpha: 1,
      duration: 500,
      delay: 700,
      ease: 'Power2.easeOut'
    })
  }

  addParticles() {
    // 创建粒子系统
    const particles = this.add.particles('logo')
    
    const emitter = particles.createEmitter({
      x: { min: 0, max: this.sys.game.config.width },
      y: -50,
      lifespan: 2000,
      speed: { min: 100, max: 200 },
      gravity: 200,
      scale: { start: 0.1, end: 0.05 },
      alpha: { start: 0.5, end: 0 },
      frequency: 2000,
      maxParticles: 5
    })
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
          // 第一关只生成4种类型的方块
          if (this.level === 1) {
            blockType = Phaser.Math.Between(1, 4)
          } else {
            blockType = Phaser.Math.Between(1, this.blockTypes)
          }
        } while (this.checkThreeInARow(x, y, blockType))

        this.board[y][x] = blockType
        // 使用图片创建方块
        const block = this.add.image(
          this.boardX + x * this.blockSize + this.blockSize / 2,
          this.boardY - 100, // 从上方生成
          `block${blockType}`
        )
        const blockScale = 0.8
        block.setDisplaySize(this.blockSize * blockScale, this.blockSize * blockScale)
        block.setData('x', x)
        block.setData('y', y)
        block.setData('type', blockType)
        block.setData('scale', blockScale) // 保存原始缩放比例
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

    // 只允许相邻方块交换
    if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
      return false
    }

    // 检查交换后是否会形成匹配
    const type1 = block1.getData('type')
    const type2 = block2.getData('type')

    // 临时交换
    const temp = this.board[y1][x1]
    this.board[y1][x1] = this.board[y2][x2]
    this.board[y2][x2] = temp

    // 检查是否有匹配
    const hasMatch = this.checkMatches().length > 0

    // 交换回来
    this.board[y2][x2] = this.board[y1][x1]
    this.board[y1][x1] = temp

    return hasMatch
  }

  swapBlocks(block1, block2) {
    // 交换两个方块的位置和类型
    // 边界条件检查
    if (!block1 || !block2 || !block1.getData || !block2.getData || !block1.active || !block2.active) {
      // 取消选择
      this.selectedBlock = null
      this.updateBlockSelection()
      return
    }

    const x1 = block1.getData('x')
    const y1 = block1.getData('y')
    const x2 = block2.getData('x')
    const y2 = block2.getData('y')
    const type1 = block1.getData('type')
    const type2 = block2.getData('type')

    // 检查数据有效性
    if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined || type1 === undefined || type2 === undefined) {
      // 取消选择
      this.selectedBlock = null
      this.updateBlockSelection()
      return
    }

    // 交换游戏板中的数据
    this.board[y1][x1] = type2
    this.board[y2][x2] = type1

    // 交换方块的位置
    const tempX = block1.x
    const tempY = block1.y

    // 保存原始缩放值
    const originalScale1 = block1.getData('scale') || 0.8
    const originalScale2 = block2.getData('scale') || 0.8
    
    // 交换动画
    this.tweens.add({
      targets: block1,
      x: block2.x,
      y: block2.y,
      duration: 200,
      ease: 'Power2.easeInOut',
      onStart: () => {
        // 检查方块是否仍然有效
        if (!block1.active || !block2.active) {
          return
        }
        
        // 交换开始时的视觉效果
        this.tweens.add({
          targets: block1,
          scale: originalScale1 * 1.1,
          duration: 100,
          yoyo: true
        })
        this.tweens.add({
          targets: block2,
          scale: originalScale2 * 1.1,
          duration: 100,
          yoyo: true
        })
      },
      onComplete: () => {
        // 检查方块是否仍然有效
        if (!block1.active || !block2.active) {
          // 取消选择
          this.selectedBlock = null
          this.updateBlockSelection()
          return
        }
        
        this.tweens.add({
          targets: block2,
          x: tempX,
          y: tempY,
          duration: 200,
          ease: 'Power2.easeInOut',
          onComplete: () => {
            // 检查方块是否仍然有效
            if (!block1.active || !block2.active) {
              // 取消选择
              this.selectedBlock = null
              this.updateBlockSelection()
              return
            }
            
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
              // 只有当步数大于0时才减少步数
              if (this.moves > 0) {
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
              }
            } else {
              // 检查是否是相同类型的方块
              if (type1 === type2) {
                // 相同类型的方块，位置不变，不消耗步数
                this.addTextFeedback(block1.x, block1.y, '相同方块', 0xf39c12)
              } else {
                // 不同类型的方块，没有消除，交换回来
                this.swapBlocksBack(block1, block2)
                this.addTextFeedback(block1.x, block1.y, '无效交换', 0xe74c3c)
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

  addTextFeedback(x, y, text, color) {
    // 添加文本反馈效果
    const feedbackText = this.add.text(x, y, text, {
      fontSize: '20px',
      fill: `#${color.toString(16).padStart(6, '0')}`,
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    this.tweens.add({
      targets: feedbackText,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2.easeOut',
      onComplete: () => {
        feedbackText.destroy()
      }
    })
  }

  swapBlocksBack(block1, block2) {
    // 交换回来
    // 边界条件检查
    if (!block1 || !block2 || !block1.getData || !block2.getData || !block1.active || !block2.active) {
      return
    }

    const x1 = block1.getData('x')
    const y1 = block1.getData('y')
    const x2 = block2.getData('x')
    const y2 = block2.getData('y')
    const type1 = block1.getData('type')
    const type2 = block2.getData('type')

    // 检查数据有效性
    if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined || type1 === undefined || type2 === undefined) {
      return
    }

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
        // 检查方块是否仍然有效
        if (!block1.active || !block2.active) {
          return
        }
        
        this.tweens.add({
          targets: block2,
          x: tempX,
          y: tempY,
          duration: 200,
          onComplete: () => {
            // 检查方块是否仍然有效
            if (!block1.active || !block2.active) {
              return
            }
            
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
    const matched = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(false))

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
              if (!matched[y][i]) {
                matches.push({ x: i, y: y })
                matched[y][i] = true
              }
            }
          }
          count = 1
          startX = x
        }
      }
      if (count >= 3) {
        for (let i = startX; i < this.boardWidth; i++) {
          if (!matched[y][i]) {
            matches.push({ x: i, y: y })
            matched[y][i] = true
          }
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
              if (!matched[i][x]) {
                matches.push({ x: x, y: i })
                matched[i][x] = true
              }
            }
          }
          count = 1
          startY = y
        }
      }
      if (count >= 3) {
        for (let i = startY; i < this.boardHeight; i++) {
          if (!matched[i][x]) {
            matches.push({ x: x, y: i })
            matched[i][x] = true
          }
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
          // 添加消除动画 - 不改变缩放，只改变透明度
          this.tweens.add({
            targets: block,
            alpha: 0,
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

    // 更新combo计数
    if (matches.length > 0) {
      this.comboCount++
      // 检查是否触发combo暴击
      if (this.comboCount >= this.comboThreshold) {
        this.triggerCombo()
      }
    } else {
      // 重置combo计数
      this.comboCount = 0
    }

    // 计算分数，添加combo加成
    let baseScore = matches.length * 10
    let comboMultiplier = 1
    if (this.comboCount >= this.comboThreshold) {
      comboMultiplier = 1 + (this.comboCount - this.comboThreshold) * 0.5
    }
    const finalScore = Math.floor(baseScore * comboMultiplier)
    this.score += finalScore
    
    this.scoreText.setText(`${this.score}/${this.scoreTarget}`)
    // 更新分数进度条
    if (this.scoreProgressFill) {
      this.scoreProgressFill.clear()
      const progressWidth = Math.min(260 * this.score / this.scoreTarget, 260)
      this.scoreProgressFill.fillStyle(0x4CAF50, 0.8)
      this.scoreProgressFill.fillRoundedRect(70, 150, progressWidth, 10, 5)
    }
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

  triggerCombo() {
    // 触发combo暴击效果
    const centerX = this.sys.game.config.width / 2
    const centerY = this.sys.game.config.height / 2
    
    // 显示combo文本
    if (this.comboText) {
      this.comboText.destroy()
    }
    
    this.comboText = this.add.text(centerX, centerY - 100, `COMBO ${this.comboCount}!`, {
      fontSize: '48px',
      fill: '#FFD700',
      fontStyle: 'bold',
      stroke: '#FF8C00',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    // combo文本动画
    this.tweens.add({
      targets: this.comboText,
      y: centerY - 200,
      alpha: 0,
      duration: 1000,
      ease: 'Power2.easeOut',
      onComplete: () => {
        if (this.comboText) {
          this.comboText.destroy()
          this.comboText = null
        }
      }
    })
    
    // 粒子效果 - 使用更轻量级的实现，避免影响游戏逻辑
    try {
      // 确保logo纹理存在
      if (this.textures.exists('logo')) {
        const particles = this.add.particles('logo')
        const emitter = particles.createEmitter({
          x: centerX,
          y: centerY,
          lifespan: 1000,
          speed: { min: 100, max: 300 },
          scale: { start: 0.2, end: 0 },
          alpha: { start: 1, end: 0 },
          frequency: 50,
          maxParticles: 20,
          blendMode: 'ADD'
        })
        
        // 1秒后停止粒子发射并清理
        this.time.delayedCall(1000, () => {
          if (emitter) {
            emitter.stop()
            // 延迟销毁粒子系统，避免影响游戏逻辑
            this.time.delayedCall(500, () => {
              if (particles) {
                particles.destroy()
              }
            })
          }
        })
      }
    } catch (error) {
      console.error('Error creating particles:', error)
      // 即使粒子系统创建失败，也不影响游戏逻辑
    }
  }

  fillBlocks() {
    // 填充新方块
    // 边界条件检查
    if (!this.board || this.board.length === 0 || !this.blocks) {
      return
    }
    
    for (let x = 0; x < this.boardWidth; x++) {
      let emptySpaces = 0
      // 从下往上填充
      for (let y = this.boardHeight - 1; y >= 0; y--) {
        // 确保board数据有效
        if (!this.board[y]) {
          continue
        }
        
        if (this.board[y][x] === 0) {
          emptySpaces++
        } else if (emptySpaces > 0) {
          // 下移方块
          if (y + emptySpaces < this.boardHeight && this.board[y + emptySpaces]) {
            this.board[y + emptySpaces][x] = this.board[y][x]
            this.board[y][x] = 0
            // 更新方块位置
            for (const block of this.blocks) {
              if (block && block.getData && block.getData('x') === x && block.getData('y') === y) {
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
      }
      // 顶部填充新方块
      for (let y = 0; y < emptySpaces; y++) {
        let blockType
        do {
          // 第一关只生成4种类型的方块
          if (this.level === 1) {
            blockType = Phaser.Math.Between(1, 4)
          } else {
            blockType = Phaser.Math.Between(1, this.blockTypes)
          }
        } while (this.checkThreeInARow(x, y, blockType))
        
        // 确保board数据有效
        if (this.board[y]) {
          this.board[y][x] = blockType
          // 创建新方块
          try {
            const block = this.add.image(
              this.boardX + x * this.blockSize + this.blockSize / 2,
              this.boardY - (emptySpaces - y) * this.blockSize + this.blockSize / 2,
              `block${blockType}`
            )
            const blockScale = 0.8
            block.setDisplaySize(this.blockSize * blockScale, this.blockSize * blockScale)
            block.setData('x', x)
            block.setData('y', y)
            block.setData('type', blockType)
            block.setData('scale', blockScale) // 保存原始缩放比例
            block.setInteractive()
            this.blocks.push(block)

            // 添加下落动画
            this.tweens.add({
              targets: block,
              y: this.boardY + y * this.blockSize + this.blockSize / 2,
              duration: 300
            })
          } catch (error) {
            console.error('Error creating block:', error)
            // 即使方块创建失败，也继续处理其他方块
          }
        }
      }
    }

    // 等待动画完成后，检查是否有新的匹配
    this.time.delayedCall(300, () => {
      if (this.checkForNewMatches) {
        this.checkForNewMatches()
      }
    })
  }

  checkForNewMatches() {
    // 检查是否有新的匹配
    const newMatches = this.checkMatches()
    if (newMatches.length > 0) {
      // 使用延时调用避免栈溢出
      this.time.delayedCall(100, () => {
        this.removeMatches(newMatches)
      })
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
    // 创建半透明背景
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height)
    overlay.setDepth(1000) // 设置高深度，确保在最上层
    
    // 创建游戏结束面板
    const panelBg = this.add.graphics()
    panelBg.fillStyle(0x1a1a2e, 0.9)
    panelBg.fillRoundedRect(this.sys.game.config.width / 2 - 200, this.sys.game.config.height / 2 - 150, 400, 350, 20)
    panelBg.setDepth(1001) // 设置高深度，确保在最上层
    
    // 添加边框
    const panelBorder = this.add.graphics()
    panelBorder.lineStyle(3, 0xe74c3c, 1)
    panelBorder.strokeRoundedRect(this.sys.game.config.width / 2 - 200, this.sys.game.config.height / 2 - 150, 400, 350, 20)
    panelBorder.setDepth(1001) // 设置高深度，确保在最上层
    
    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 100, '游戏结束', {
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#e74c3c',
      strokeThickness: 2
    }).setOrigin(0.5)
    title.setDepth(1002) // 设置高深度，确保在最上层
    
    // 添加分数信息
    const scoreText1 = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 30, `最终分数: ${this.score}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    scoreText1.setDepth(1002) // 设置高深度，确保在最上层

    const scoreText2 = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 10, `目标分数: ${this.scoreTarget}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    scoreText2.setDepth(1002) // 设置高深度，确保在最上层

    // 添加重新开始按钮
    const restartButtonBg = this.add.graphics()
    restartButtonBg.fillStyle(0x3498db, 0.8)
    restartButtonBg.fillRoundedRect(0, 0, 180, 60, 20)
    
    const restartButton = this.add.container(this.sys.game.config.width / 2 - 100, this.sys.game.config.height / 2 + 80, [restartButtonBg])
    restartButton.setDepth(1003) // 设置高深度，确保在最上层
    const restartButtonText = this.add.text(0, 0, '重新开始', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    restartButtonText.setDepth(1004) // 设置高深度，确保在最上层
    restartButton.add(restartButtonText)
    
    restartButton.setInteractive(new Phaser.Geom.Rectangle(-90, -30, 180, 60), Phaser.Geom.Rectangle.Contains)
    restartButton.on('pointerdown', () => {
      this.scene.restart()
    })
    
    // 按钮悬停效果
    restartButton.on('pointerover', () => {
      restartButtonBg.fillStyle(0x2980b9, 1)
      this.tweens.add({
        targets: restartButton,
        scale: 1.05,
        duration: 100
      })
    })
    restartButton.on('pointerout', () => {
      restartButtonBg.fillStyle(0x3498db, 0.8)
      this.tweens.add({
        targets: restartButton,
        scale: 1,
        duration: 100
      })
    })

    // 添加返回按钮
    const backButtonBg = this.add.graphics()
    backButtonBg.fillStyle(0xe74c3c, 0.8)
    backButtonBg.fillRoundedRect(0, 0, 180, 60, 20)
    
    const backButton = this.add.container(this.sys.game.config.width / 2 + 100, this.sys.game.config.height / 2 + 80, [backButtonBg])
    backButton.setDepth(1003) // 设置高深度，确保在最上层
    const backButtonText = this.add.text(0, 0, '返回关卡选择', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    backButtonText.setDepth(1004) // 设置高深度，确保在最上层
    backButton.add(backButtonText)
    
    backButton.setInteractive(new Phaser.Geom.Rectangle(-90, -30, 180, 60), Phaser.Geom.Rectangle.Contains)
    backButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene')
    })
    
    // 按钮悬停效果
    backButton.on('pointerover', () => {
      backButtonBg.fillStyle(0xc0392b, 1)
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButtonBg.fillStyle(0xe74c3c, 0.8)
      this.tweens.add({
        targets: backButton,
        scale: 1,
        duration: 100
      })
    })
    
    // 进入动画
    overlay.setAlpha(0)
    panelBg.setAlpha(0)
    panelBorder.setAlpha(0)
    title.setScale(0).setAlpha(0)
    scoreText1.setAlpha(0)
    scoreText2.setAlpha(0)
    restartButton.setScale(0).setAlpha(0)
    backButton.setScale(0).setAlpha(0)
    
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 300,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: panelBg,
      alpha: 1,
      duration: 300,
      delay: 100,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: panelBorder,
      alpha: 1,
      duration: 300,
      delay: 150,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 200,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: [scoreText1, scoreText2],
      alpha: 1,
      duration: 500,
      delay: 250,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: restartButton,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: 'Bounce.easeOut'
    })
    
    this.tweens.add({
      targets: backButton,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 350,
      ease: 'Bounce.easeOut'
    })
  }

  gameWin() {
    // 创建半透明背景
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height)
    
    // 创建游戏胜利面板
    const panelBg = this.add.graphics()
    panelBg.fillStyle(0x1a1a2e, 0.9)
    panelBg.fillRoundedRect(this.sys.game.config.width / 2 - 200, this.sys.game.config.height / 2 - 150, 400, 350, 20)
    
    // 添加边框
    const panelBorder = this.add.graphics()
    panelBorder.lineStyle(3, 0x27ae60, 1)
    panelBorder.strokeRoundedRect(this.sys.game.config.width / 2 - 200, this.sys.game.config.height / 2 - 150, 400, 350, 20)
    
    // 添加标题
    const title = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 100, '游戏胜利！', {
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#27ae60',
      strokeThickness: 2
    }).setOrigin(0.5)
    
    // 添加分数信息
    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 30, `最终分数: ${this.score}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 10, `目标分数: ${this.scoreTarget}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)

    // 添加重新开始按钮
    const restartButtonBg = this.add.graphics()
    restartButtonBg.fillStyle(0x3498db, 0.8)
    restartButtonBg.fillRoundedRect(0, 0, 180, 60, 20)
    
    const restartButton = this.add.container(this.sys.game.config.width / 2 - 100, this.sys.game.config.height / 2 + 60, [restartButtonBg])
    restartButton.setDepth(1003) // 设置高深度，确保在最上层
    const restartButtonText = this.add.text(0, 0, '重新开始', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    restartButtonText.setDepth(1004) // 设置高深度，确保在最上层
    restartButton.add(restartButtonText)
    
    restartButton.setInteractive(new Phaser.Geom.Rectangle(-90, -30, 180, 60), Phaser.Geom.Rectangle.Contains)
    restartButton.on('pointerdown', () => {
      this.scene.restart()
    })
    
    // 按钮悬停效果
    restartButton.on('pointerover', () => {
      restartButtonBg.fillStyle(0x2980b9, 1)
      this.tweens.add({
        targets: restartButton,
        scale: 1.05,
        duration: 100
      })
    })
    restartButton.on('pointerout', () => {
      restartButtonBg.fillStyle(0x3498db, 0.8)
      this.tweens.add({
        targets: restartButton,
        scale: 1,
        duration: 100
      })
    })

    // 添加返回按钮
    const backButtonBg = this.add.graphics()
    backButtonBg.fillStyle(0x27ae60, 0.8)
    backButtonBg.fillRoundedRect(0, 0, 180, 60, 20)
    
    const backButton = this.add.container(this.sys.game.config.width / 2 + 100, this.sys.game.config.height / 2 + 60, [backButtonBg])
    backButton.setDepth(1003) // 设置高深度，确保在最上层
    const backButtonText = this.add.text(0, 0, '返回关卡选择', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    backButtonText.setDepth(1004) // 设置高深度，确保在最上层
    backButton.add(backButtonText)
    
    backButton.setInteractive(new Phaser.Geom.Rectangle(-90, -30, 180, 60), Phaser.Geom.Rectangle.Contains)
    backButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene')
    })
    
    // 按钮悬停效果
    backButton.on('pointerover', () => {
      backButtonBg.fillStyle(0x229954, 1)
      this.tweens.add({
        targets: backButton,
        scale: 1.05,
        duration: 100
      })
    })
    backButton.on('pointerout', () => {
      backButtonBg.fillStyle(0x27ae60, 0.8)
      this.tweens.add({
        targets: backButton,
        scale: 1,
        duration: 100
      })
    })
    
    // 进入动画
    overlay.setAlpha(0)
    panelBg.setAlpha(0)
    panelBorder.setAlpha(0)
    title.setScale(0).setAlpha(0)
    scoreText1.setAlpha(0)
    scoreText2.setAlpha(0)
    restartButton.setScale(0).setAlpha(0)
    backButton.setScale(0).setAlpha(0)
    
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 300,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: panelBg,
      alpha: 1,
      duration: 300,
      delay: 100,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: panelBorder,
      alpha: 1,
      duration: 300,
      delay: 150,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 200,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: [scoreText1, scoreText2],
      alpha: 1,
      duration: 500,
      delay: 250,
      ease: 'Power2.easeOut'
    })
    
    this.tweens.add({
      targets: restartButton,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: 'Bounce.easeOut'
    })
    
    this.tweens.add({
      targets: backButton,
      scale: 1,
      alpha: 1,
      duration: 500,
      delay: 350,
      ease: 'Bounce.easeOut'
    })
  }

  updateTimer() {
    // 更新倒计时
    this.currentTime--
    if (this.timeText) {
      this.timeText.setText(`${this.currentTime}`)
      
      // 添加时间变化动画
      this.tweens.add({
        targets: this.timeText,
        scale: 1.2,
        duration: 200,
        yoyo: true,
        repeat: 1
      })
      
      // 时间少于10秒时添加警告效果
      if (this.currentTime <= 10) {
        this.tweens.add({
          targets: this.timeText,
          color: 0xff0000,
          duration: 500,
          yoyo: true,
          repeat: -1
        })
      }
    }
    
    // 时间结束
    if (this.currentTime <= 0) {
      this.gameOver()
    }
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


// 游戏配置
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [LoginScene, LevelSelectScene, CustomLevelScene, GameScene],
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
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600
    },
    max: {
      width: 1920,
      height: 1080
    }
  }
}

// 创建游戏实例
const game = new Phaser.Game(config)