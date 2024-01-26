import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Player, Transaction } from '../../models/game.model';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  public players$: Observable<Player[]>;
  public transactionHistory$: Observable<Transaction[]>;

  public newPlayerName: string = '';
  public selectedSender: Player | undefined;
  public selectedReceiver: Player | undefined;
  public transactionAmount: number = 0;

  constructor(private gameService: GameService) {
    this.players$ = this.gameService.players$;
    this.transactionHistory$ = this.gameService.transactionHistory$;
  }

  ngOnInit(): void {
    this.gameService.restoreGameState();
  }

  addPlayer(): void {
    if (this.newPlayerName.trim() !== '') {
      this.gameService.addPlayer(this.newPlayerName);
      this.newPlayerName = '';
      this.gameService.saveGameState();
    }
  }

  makeTransaction(sender: Player | undefined, receiver: Player | undefined, amount: number): void {
    if (sender && receiver) {
      this.gameService.makeTransaction(sender, receiver, amount);
      this.gameService.saveGameState();
    } else {
      console.error('Выберите отправителя и получателя для транзакции.');
    }
  }
}
