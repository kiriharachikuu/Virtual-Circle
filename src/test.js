import './style.css'
import Phaser from 'phaser'

// 简单的测试场景
class TestScene extends Phaser.Scene {
  constructor() {
    super('TestScene')
  }

  create() {
    // 设置背景
    this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x1a1a2e).setOrigin(0, 0)

    // 添加测试文本
    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, '测试页面', {
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 60, '如果看到此文本，说明Phaser初始化成功', {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)
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