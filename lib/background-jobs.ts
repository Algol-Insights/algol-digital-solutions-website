import { prisma } from '@/lib/db/prisma'
import { SalesVelocityService } from '@/lib/services/sales-velocity.service'
import { StockRecommendationService } from '@/lib/services/stock-recommendation.service'
import { AutoReorderService } from '@/lib/services/auto-reorder.service'
import { DeadStockService } from '@/lib/services/dead-stock.service'

type JobType = 'SALES_VELOCITY' | 'STOCK_RECOMMENDATIONS' | 'AUTO_REORDER' | 'DEAD_STOCK_DETECTION'
type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

interface Job {
  id: string
  type: JobType
  status: JobStatus
  result?: any
  error?: string
  startedAt?: Date
  completedAt?: Date
}

class BackgroundJobQueue {
  private queue: Job[] = []
  private running = false

  enqueue(type: JobType): string {
    const job: Job = {
      id: `${type}-${Date.now()}`,
      type,
      status: 'PENDING',
    }
    this.queue.push(job)
    this.processNext()
    return job.id
  }

  private async processNext() {
    if (this.running) return
    const job = this.queue.find((j) => j.status === 'PENDING')
    if (!job) return

    this.running = true
    job.status = 'RUNNING'
    job.startedAt = new Date()

    try {
      const result = await this.executeJob(job.type)
      job.status = 'COMPLETED'
      job.result = result
      job.completedAt = new Date()
    } catch (error) {
      job.status = 'FAILED'
      job.error = error instanceof Error ? error.message : 'Unknown error'
      job.completedAt = new Date()
    } finally {
      this.running = false
      this.processNext()
    }
  }

  private async executeJob(type: JobType) {
    switch (type) {
      case 'SALES_VELOCITY':
        return await SalesVelocityService.updateAllVelocities()
      case 'STOCK_RECOMMENDATIONS':
        return await StockRecommendationService.generateAllRecommendations()
      case 'AUTO_REORDER':
        return await AutoReorderService.checkAllProductsForReorder()
      case 'DEAD_STOCK_DETECTION':
        return await DeadStockService.detectDeadStock()
      default:
        throw new Error(`Unknown job type: ${type}`)
    }
  }

  getStatus(id: string): Job | undefined {
    return this.queue.find((j) => j.id === id)
  }

  getAll(): Job[] {
    return [...this.queue]
  }

  clearCompleted() {
    this.queue = this.queue.filter((j) => j.status !== 'COMPLETED' && j.status !== 'FAILED')
  }
}

const globalAny = global as any
if (!globalAny.__BG_JOB_QUEUE) {
  globalAny.__BG_JOB_QUEUE = new BackgroundJobQueue()
}

export const jobQueue: BackgroundJobQueue = globalAny.__BG_JOB_QUEUE
