import { RawLocation } from 'vue-router'
import Vue from 'vue'

export type NextFunction = (to?: RawLocation | false | ((vm: Vue) => any) | void) => void
