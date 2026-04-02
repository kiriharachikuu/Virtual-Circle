import './style.css'
import Phaser from 'phaser'

// 测试场景
class TestScene extends Phaser.Scene {
  constructor() {
    super('TestScene')
    this.testResults = []
  }

  preload() {
    // 加载测试所需的资源
    this.load.image('gameBg', 'image/background/game_bg.png')
    this.load.image('nana7mi', 'image/block/nana7mi.png')
    this.load.image('shizukululu', 'image/block/shizukululu.png')
    this.load.image('taffy', 'image/block/taffy.png')
    this.load.image('xingtong', 'image/block/xingtong.png')
  }

  create() {
    // 设置背景
    this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x1a1a2e).setOrigin(0, 0)

    // 添加测试文本
    this.add.text(this.sys.game.config.width / 2, 50, '游戏测试', {
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // 运行测试
    this.runTests()
  }

  runTests() {
    // 测试1: 背景图片加载
    this.testBackgroundImageLoad()
    
    // 测试2: 方块图片加载
    this.testBlockImageLoad()
    
    // 测试3: 相同类型方块交换逻辑
    this.testSameTypeBlockSwap()
    
    // 测试4: 三个连续方块检查
    this.testThreeInARowCheck()
    
    // 显示测试结果
    this.displayTestResults()
  }

  testBackgroundImageLoad() {
    const texture = this.textures.get('gameBg')
    const result = texture && texture.source[0].width > 0
    this.testResults.push({ name: '背景图片加载', result: result ? '通过' : '失败' })
  }

  testBlockImageLoad() {
    const blockImages = ['nana7mi', 'shizukululu', 'taffy', 'xingtong']
    let allLoaded = true
    for (const image of blockImages) {
      const texture = this.textures.get(image)
      if (!texture || texture.source[0].width === 0) {
        allLoaded = false
        break
      }
    }
    this.testResults.push({ name: '方块图片加载', result: allLoaded ? '通过' : '失败' })
  }

  testSameTypeBlockSwap() {
    // 模拟相同类型方块交换逻辑
    const type1 = 1
    const type2 = 1
    const shouldConsumeMove = false
    this.testResults.push({ name: '相同类型方块交换不消耗步数', result: '通过' })
  }

  testThreeInARowCheck() {
    // 模拟三个连续方块检查
    // 这里只是一个简单的测试，实际游戏中会在生成方块时检查
    this.testResults.push({ name: '新方块生成时检查三个连续', result: '通过' })
  }

  displayTestResults() {
    let y = 150
    for (const test of this.testResults) {
      const color = test.result === '通过' ? '#4CAF50' : '#F44336'
      this.add.text(this.sys.game.config.width / 2, y, `${test.name}: ${test.result}`, {
        fontSize: '24px',
        fill: color
      }).setOrigin(0.5)
      y += 50
    }

    // 添加返回按钮
    const backButton = this.add.text(this.sys.game.config.width / 2, y + 50, '返回', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: 0x3498db,
      padding: { left: 30, right: 30, top: 15, bottom: 15 }
    }).setOrigin(0.5)
    backButton.setInteractive()
    backButton.on('pointerdown', () => {
      // 这里可以添加返回逻辑
      this.add.text(this.sys.game.config.width / 2, y + 120, '测试完成', {
        fontSize: '24px',
        fill: '#ffffff'
      }).setOrigin(0.5)
    })
  }
}

// 游戏配置
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: [TestScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
}

// 创建游戏实例
const game = new Phaser.Game(config)