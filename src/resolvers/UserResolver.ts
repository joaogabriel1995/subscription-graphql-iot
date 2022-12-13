import { Query, Resolver } from 'type-graphql'
import { DataMachine } from '../models/DataMachine'

@Resolver()
export class UserResolver {
  private data: DataMachine[] = []

  @Query(() => [DataMachine])
  async hello() {
    return this.data
  }
}
