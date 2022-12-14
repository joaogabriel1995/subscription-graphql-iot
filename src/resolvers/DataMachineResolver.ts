import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Int,
  Subscription,
  Root,
  PubSub,
  PubSubEngine
} from 'type-graphql'
import { DataMachine } from '../models/DataMachine'

@Resolver()
export class UserResolver {
  private data: DataMachine[] = []

  @Query(() => [DataMachine])
  async getDataMachine() {
    return this.data
  }
  @Mutation(() => [DataMachine])
  async createDataMachine(
    @Arg('OnOff') OnOff: number,
    @PubSub() pubSub: PubSubEngine
  ) {
    const dataMachine = { OnOff }
    this.data.push(dataMachine)
    const payload: DataMachine = { OnOff }
    await pubSub.publish('NOTIFICATIONS', payload)
    return this.data
  }
  @Subscription({
    topics: 'NOTIFICATIONS'
  })
  subscriptionDataMachine(
    @Root() notificationPayload: DataMachine
  ): DataMachine {
    return {
      ...notificationPayload
    }
  }
}
