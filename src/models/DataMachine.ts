import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class DataMachine {
  @Field(type => Int)
  OnOff: number
}
