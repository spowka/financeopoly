import { Injectable } from '@angular/core';
import { Player, Transaction } from '../models/game.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _players$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  public players$: Observable<Player[]> = this._players$.asObservable();

  private _transactionHistory$: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);
  public transactionHistory$: Observable<Transaction[]> = this._transactionHistory$.asObservable();

  public addPlayer(name: string): void {
    const newPlayer: Player = {
      name,
      balance: 15e6,
    };

    this._players$.next([...this._players$.getValue(), newPlayer]);
    this.addToTransactionHistory(`${name} присоединился к игре.`, 0);
  }

  public makeTransaction(sender: Player, receiver: Player, amount: number): void {
    if (sender.balance >= amount) {
      sender.balance -= amount;
      receiver.balance += amount;
      this.addToTransactionHistory(
        `${sender.name} передал ${amountToString(amount)} игроку ${receiver.name}.`,
        amount
      );
    } else {
      console.error('Недостаточно средств для транзакции.');
    }
  }

  public saveGameState(): void {
    localStorage.setItem('players', JSON.stringify(this._players$.getValue()));
    localStorage.setItem('transactionHistory', JSON.stringify(this._transactionHistory$.getValue()));
  }

  public restoreGameState(): void {
    const players = localStorage.getItem('players');
    if (players) {
      this._players$.next(JSON.parse(players));
    }

    const transactionHistory = localStorage.getItem('transactionHistory');
    if (transactionHistory) {
      this._transactionHistory$.next(JSON.parse(transactionHistory));
    }
  }

  private addToTransactionHistory(description: string, amount: number): void {
    const transaction: Transaction = {
      description,
      amount,
    };

    this._transactionHistory$.next([...this._transactionHistory$.getValue(), transaction]);
  }
}

function amountToString(amount: number): string {
  if (amount >= 1e6) {
    return `${amount / 1e6} миллионов`;
  } else if (amount >= 1000) {
    return `${amount / 1000} тысяч`;
  } else {
    return `${amount}`;
  }
}
